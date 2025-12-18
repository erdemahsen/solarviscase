from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from typing import Dict, List, Any 

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic stuff is mandatory apparently. However this looks cooked here. We should move it somewhere better
class CalculateRequest(BaseModel):
    formData: Dict[str, Any]  # Matches your React "formData" object
    calculations: List[Any]   # Matches your React "calculations" array

@app.get("/")
def home():
    return "Home"

@app.post("/api/calculate")
def app_calculate(payload: CalculateRequest): 
    # we can get the post payload
    # print(payload.formData)      
    # print(payload.calculations)

    # Mock calculation result here 
    return {
        "results": [
            {"key": 'A', "value": 140000, "unit": 'kWh'},
            {"key": 'B', "value": 700, "unit": 'USD'}
        ],
        "calculatedAt": "tempDate"
    }


@app.get("/api/app")
def app_config():
    # FastAPI turns dict into JSON automatically :)
    return {
        "numInputPages": 2,
        "pages": [
            {
                "id": 1,
                "title": "Energy Basics",
                "description": "Tell us about your current usage.",
                "image": "https://example.com/solar-1.jpg",
                "inputs": [
                    {
                        "name": "X",
                        "placeholder": "Monthly Bill ($)",
                        "type": "number"
                    }
                ]
            },
            {
                "id": 2,
                "title": "Home Details",
                "description": "Dimensions and location.",
                "image": "https://example.com/solar-2.jpg",
                "inputs": [
                    {
                        "name": "Y",
                        "placeholder": "Roof Area (sqm)",
                        "type": "number"
                    },
                    {
                        "name": "Z",
                        "placeholder": "Sunlight Hours",
                        "type": "number"
                    }
                ]
            }
        ],
        "calculations": [
            {
                "outputName": "A",
                "formula": "(Y * 100000 + Z * 50000) - (X * 10000)",
                "unit": "kWh"
            },
            {
                "outputName": "B",
                "formula": "A / 200",
                "unit": "USD"
            }
        ],
        "outputPage": {
            "title": "Your Solar Potential",
            "description": "Based on your inputs, here is your estimate.",
            "image": "https://example.com/result.jpg"
        }
    }
