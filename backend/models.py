from pydantic import BaseModel, Field
from typing import Optional

class Flight(BaseModel):
    airline: str
    price: float

class WatchlistItem(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: str
    threshold: float
    airline: str

class WatchlistItemResponse(WatchlistItem):
    id: int = Field(alias="index")

    class Config:
        populate_by_name = True

class SearchFlightsRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None

class FlightSearchResponse(BaseModel):
    flights: list[Flight]

class AddFlightRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: str
    threshold: float
    airline: str
