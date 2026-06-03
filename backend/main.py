"""
MetaTraffic AI | Comparative Optimization — FastAPI Backend

Comparative Optimization of Urban Traffic Signal Timing
using GA, PSO, and SA.

This is the main entry point for the backend server.
Run with: python main.py
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import router

# Create FastAPI application
app = FastAPI(
    title="MetaTraffic AI | Comparative Optimization API",
    description=(
        "Backend API for comparative optimization of urban traffic signal timing. "
        "Provides endpoints for traffic simulation, GA/PSO/SA optimization, "
        "baseline comparison, and results export."
    ),
    version="1.0.0",
)

# CORS middleware — allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "MetaTraffic AI API",
        "version": "1.0.0",
        "description": "Comparative Optimization of Urban Traffic Signal Timing",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "config": "/api/config",
            "simulate": "/api/simulate",
            "optimize": "/api/optimize",
            "compare": "/api/compare",
            "export": "/api/export",
        },
    }


if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
