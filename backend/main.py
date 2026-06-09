from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import flights, watchlist

app = FastAPI(title="Flight Price Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flights.router, prefix="/api/flights", tags=["flights"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
