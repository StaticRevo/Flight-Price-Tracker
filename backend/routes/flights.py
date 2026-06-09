from fastapi import APIRouter, HTTPException
from models import SearchFlightsRequest, FlightSearchResponse, Flight
from services import search_flights

router = APIRouter()

@router.post("/search", response_model=FlightSearchResponse)
def search(request: SearchFlightsRequest):
    """Search for flights"""
    try:
        flights = search_flights(
            request.origin,
            request.destination,
            request.departure_date,
            request.return_date
        )
        return {"flights": flights}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
