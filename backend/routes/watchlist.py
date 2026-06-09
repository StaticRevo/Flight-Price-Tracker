from fastapi import APIRouter, HTTPException
from models import WatchlistItem, AddFlightRequest
from services import (
    add_to_watchlist,
    get_watchlist,
    remove_from_watchlist,
    check_watchlist_prices
)

router = APIRouter()

@router.get("/")
def list_watchlist():
    """Get all watched flights"""
    try:
        items = get_watchlist()
        return {"watchlist": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add")
def add_flight(flight: AddFlightRequest):
    """Add flight to watchlist"""
    try:
        index = add_to_watchlist(flight.dict())
        return {"id": index, "message": "Flight added to watchlist"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{flight_id}")
def remove_flight(flight_id: int):
    """Remove flight from watchlist"""
    try:
        removed = remove_from_watchlist(flight_id)
        return {"message": "Flight removed", "flight": removed}
    except IndexError:
        raise HTTPException(status_code=404, detail="Flight not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/check-prices")
def check_prices():
    """Check all watched flights for price alerts"""
    try:
        alerts = check_watchlist_prices()
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
