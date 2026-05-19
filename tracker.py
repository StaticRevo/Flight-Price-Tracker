import requests
import json
import os
from dotenv import load_dotenv
from tabulate import tabulate

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
DISCORD_WEBHOOK = os.getenv("DISCORD_WEBHOOK")

WATCHLIST_FILE = "watchlist.json"

# ==========================================
# LOAD WATCHLIST
# ==========================================

def load_watchlist():

    if not os.path.exists(WATCHLIST_FILE):
        return []

    with open(WATCHLIST_FILE, "r") as file:
        return json.load(file)

# ==========================================
# SAVE WATCHLIST
# ==========================================

def save_watchlist(data):

    with open(WATCHLIST_FILE, "w") as file:
        json.dump(data, file, indent=4)

# ==========================================
# SEARCH FLIGHTS
# ==========================================

def search_flights(
    origin,
    destination,
    departure_date,
    return_date
):

    url = "https://serpapi.com/search.json"

    params = {
        "engine": "google_flights",
        "departure_id": origin,
        "arrival_id": destination,
        "outbound_date": departure_date,
        "return_date": return_date,
        "currency": "EUR",
        "hl": "en",
        "api_key": SERPAPI_KEY
    }

    response = requests.get(
        url,
        params=params
    )

    data = response.json()
    print(json.dumps(data, indent=2))

    flights = []

    all_flights = (
        data.get("best_flights", [])
        + data.get("other_flights", [])
    )

    for flight in all_flights[:5]:

        price = flight.get("price")

        airline = (
            flight["flights"][0]
            .get("airline", "Unknown")
        )

        flights.append({
            "airline": airline,
            "price": price
        })

    return flights

# ==========================================
# DISPLAY FLIGHTS
# ==========================================

def display_flights(flights):

    table = []

    for index, flight in enumerate(flights):

        table.append([
            index,
            flight["airline"],
            f"€{flight['price']}"
        ])

    print(
        tabulate(
            table,
            headers=[
                "Index",
                "Airline",
                "Price"
            ],
            tablefmt="grid"
        )
    )

# ==========================================
# ADD TRACKED FLIGHT
# ==========================================

def add_flight():

    origin = input(
        "Origin airport code (e.g. MLA): "
    ).upper()

    destination = input(
        "Destination airport code (e.g. DUB): "
    ).upper()

    departure_date = input(
        "Departure date (YYYY-MM-DD): "
    )

    return_date = input(
        "Return date (YYYY-MM-DD): "
    )

    threshold = float(
        input("Alert price threshold (€): ")
    )

    print("\nSearching flights...\n")

    flights = search_flights(
        origin,
        destination,
        departure_date,
        return_date
    )

    if not flights:
        print("No flights found.")
        return

    display_flights(flights)

    choice = int(
        input(
            "\nSelect flight index to track: "
        )
    )

    selected = flights[choice]

    watchlist = load_watchlist()

    watchlist.append({
        "origin": origin,
        "destination": destination,
        "departure_date": departure_date,
        "return_date": return_date,
        "threshold": threshold,
        "airline": selected["airline"]
    })

    save_watchlist(watchlist)

    print("\nFlight added to tracking list!")

# ==========================================
# SEND DISCORD ALERT
# ==========================================

def send_discord_alert(flight, price):

    embed = {
        "title": "✈️ Cheap Flight Alert!",
        "description": (
            f"{flight['origin']} → "
            f"{flight['destination']}"
        ),
        "color": 5763719,
        "fields": [
            {
                "name": "Airline",
                "value": flight["airline"],
                "inline": True
            },
            {
                "name": "Price",
                "value": f"€{price}",
                "inline": True
            },
            {
                "name": "Dates",
                "value": (
                    f"{flight['departure_date']} "
                    f"to "
                    f"{flight['return_date']}"
                ),
                "inline": False
            }
        ]
    }

    requests.post(
        DISCORD_WEBHOOK,
        json={
            "embeds": [embed]
        }
    )

# ==========================================
# CHECK WATCHLIST
# ==========================================

def check_watchlist():

    watchlist = load_watchlist()

    if not watchlist:
        print("No tracked flights.")
        return

    for flight in watchlist:

        flights = search_flights(
            flight["origin"],
            flight["destination"],
            flight["departure_date"],
            flight["return_date"]
        )

        if not flights:
            continue

        cheapest = min(
            flights,
            key=lambda x: x["price"]
        )

        current_price = cheapest["price"]

        print(
            f"{flight['origin']} → "
            f"{flight['destination']}: "
            f"€{current_price}"
        )

        if current_price <= flight["threshold"]:

            send_discord_alert(
                flight,
                current_price
            )

            print("Discord alert sent!")

# ==========================================
# VIEW WATCHLIST
# ==========================================

def view_watchlist():

    watchlist = load_watchlist()

    if not watchlist:
        print("\nNo tracked flights.\n")
        return

    table = []

    for index, flight in enumerate(watchlist):

        table.append([
            index,
            flight["origin"],
            flight["destination"],
            flight["departure_date"],
            flight["return_date"],
            flight["airline"],
            f"€{flight['threshold']}"
        ])

    print(
        tabulate(
            table,
            headers=[
                "Index",
                "From",
                "To",
                "Departure",
                "Return",
                "Airline",
                "Threshold"
            ],
            tablefmt="grid"
        )
    )

# ==========================================
# REMOVE TRACKED FLIGHT
# ==========================================

def remove_flight():

    watchlist = load_watchlist()

    if not watchlist:
        print("\nNo flights to remove.\n")
        return

    view_watchlist()

    index = int(
        input(
            "\nEnter index to remove: "
        )
    )

    removed = watchlist.pop(index)

    save_watchlist(watchlist)

    print(
        f"\nRemoved "
        f"{removed['origin']} → "
        f"{removed['destination']}"
    )

# ==========================================
# MENU
# ==========================================

def menu():

    while True:

        print("\n=== Flight Price Tracker ===")
        print("1. Add flight")
        print("2. Check watchlist")
        print("3. View watchlist")
        print("4. Remove flight")
        print("5. Exit")

        choice = input("\nChoice: ")

        if choice == "1":
            add_flight()

        elif choice == "2":
            check_watchlist()

        elif choice == "3":
            view_watchlist()

        elif choice == "4":
            remove_flight()

        elif choice == "5":
            break

        else:
            print("Invalid option.")

# ==========================================
# START PROGRAM
# ==========================================

if __name__ == "__main__":
    menu()