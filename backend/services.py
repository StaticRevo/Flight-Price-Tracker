import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
DISCORD_WEBHOOK = os.getenv("DISCORD_WEBHOOK")
WATCHLIST_FILE = "watchlist.json"

def load_watchlist():
    if not os.path.exists(WATCHLIST_FILE):
        return []

    with open(WATCHLIST_FILE, "r") as file:
        return json.load(file)

def save_watchlist(data):
    with open(WATCHLIST_FILE, "w") as file:
        json.dump(data, file, indent=4)

def search_flights(origin: str, destination: str, departure_date: str, return_date: str = None):
    """Search flights using SerpAPI Google Flights"""
    url = "https://serpapi.com/search.json"

    params = {
        "engine": "google_flights",
        "departure_id": origin,
        "arrival_id": destination,
        "outbound_date": departure_date,
        "currency": "EUR",
        "hl": "en",
        "api_key": SERPAPI_KEY
    }

    if return_date:
        params["return_date"] = return_date

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        flights = []
        all_flights = data.get("best_flights", []) + data.get("other_flights", [])

        for flight in all_flights[:5]:
            price = flight.get("price")
            airline = flight["flights"][0].get("airline", "Unknown")

            flights.append({
                "airline": airline,
                "price": price
            })

        return flights
    except Exception as e:
        raise Exception(f"Error searching flights: {str(e)}")

def add_to_watchlist(flight_data):
    """Add flight to watchlist"""
    watchlist = load_watchlist()
    watchlist.append(flight_data)
    save_watchlist(watchlist)
    return len(watchlist) - 1

def get_watchlist():
    """Get all watched flights"""
    return load_watchlist()

def remove_from_watchlist(index: int):
    """Remove flight from watchlist"""
    watchlist = load_watchlist()
    if 0 <= index < len(watchlist):
        removed = watchlist.pop(index)
        save_watchlist(watchlist)
        return removed
    raise IndexError("Flight index out of range")

def check_watchlist_prices():
    """Check all watched flights and send alerts if price drops below threshold"""
    watchlist = load_watchlist()
    alerts = []

    for idx, flight in enumerate(watchlist):
        try:
            flights = search_flights(
                flight["origin"],
                flight["destination"],
                flight["departure_date"],
                flight["return_date"]
            )

            if not flights:
                continue

            cheapest = min(flights, key=lambda x: x["price"])
            current_price = cheapest["price"]

            if current_price <= flight["threshold"]:
                alert = {
                    "index": idx,
                    "flight": flight,
                    "current_price": current_price,
                    "threshold": flight["threshold"]
                }
                alerts.append(alert)

                if DISCORD_WEBHOOK:
                    send_discord_alert(flight, current_price)

        except Exception as e:
            print(f"Error checking flight {idx}: {str(e)}")

    return alerts

def send_discord_alert(flight, price):
    """Send Discord webhook alert"""
    embed = {
        "title": "✈️ Cheap Flight Alert!",
        "description": f"{flight['origin']} → {flight['destination']}",
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
                "value": f"{flight['departure_date']} to {flight['return_date']}",
                "inline": False
            }
        ]
    }

    try:
        requests.post(DISCORD_WEBHOOK, json={"embeds": [embed]}, timeout=5)
    except Exception as e:
        print(f"Error sending Discord alert: {str(e)}")
