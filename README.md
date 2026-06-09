# Flight-Price-Tracker

Modern web-based flight price tracker with real-time alerts and a sleek dark-themed dashboard.

## Architecture

- **Backend**: FastAPI (Python) - REST API for flight searching and watchlist management
- **Frontend**: Next.js + React + Tailwind CSS - Dark-themed responsive dashboard
- **Storage**: JSON-based watchlist persistence

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ and npm (for frontend)
- Environment variables set in `.env` file (in `backend/` folder):
  - `SERPAPI_KEY` - Your SerpAPI key
  - `DISCORD_WEBHOOK` - (Optional) Discord webhook for alerts

## Quick Start

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file with your API keys:
```bash
SERPAPI_KEY=your_key_here
DISCORD_WEBHOOK=your_webhook_here
```

5. Run the backend (from the backend folder):
```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. In a new terminal, navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/flights/search` - Search for flights
- `GET /api/watchlist/` - Get all watched flights
- `POST /api/watchlist/add` - Add flight to watchlist
- `DELETE /api/watchlist/{id}` - Remove flight from watchlist
- `GET /api/watchlist/check-prices` - Check for price alerts

## Features

- 🔍 Real-time flight search via Google Flights
- 📋 Manage watchlist of tracked flights
- 🎉 Automatic price drop alerts
- 🔔 Discord notifications for price alerts
- 🌙 Beautiful dark-themed dashboard
- ⚡ Responsive design for all devices

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Enter origin and destination airport codes
4. Select your preferred flight
5. Set your alert price threshold
6. Track flights and receive alerts when prices drop!