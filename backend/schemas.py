from pydantic import BaseModel
from typing import List, Optional, Any

# --- 1. Variables (The Bottom of the Hierarchy) ---

class InputVariableBase(BaseModel):
    name: str # Renamed
    placeholder: Optional[str] = None # Renamed
    type: str = "number" # New

class InputVariableCreate(InputVariableBase):
    pass 

class InputVariable(InputVariableBase):
    id: int
    page_id: int

    class Config:
        from_attributes = True 

class CalculationBase(BaseModel): # Renamed from OutputVariable
    outputName: str
    formula: str
    unit: str

class CalculationCreate(CalculationBase):
    pass

class Calculation(CalculationBase):
    id: int
    config_id: int

    class Config:
        from_attributes = True

# --- 2. Pages (The Middle Layer) ---

class PageBase(BaseModel):
    title: str
    description: Optional[str] = None
    image: Optional[str] = None # Renamed
    order_index: int
    is_output_page: bool = False

class PageCreate(PageBase):
    inputs: List[InputVariableCreate] = []

class Page(PageBase):
    id: int
    config_id: int
    inputs: List[InputVariable] = []
    
    class Config:
        from_attributes = True

# --- 3. App Config (The Top Layer) ---

class AppConfigBase(BaseModel):
    app_name: str

class AppConfigCreate(AppConfigBase):
    pass

# Internal Use Only - Database Representation
class AppConfigDB(AppConfigBase):
    id: int
    pages: List[Page] = []
    calculations: List[Calculation] = []

    class Config:
        from_attributes = True

# API Response Schema - Matches specific JSON requirement
class OutputPageOut(BaseModel):
    title: str
    description: Optional[str]
    image: Optional[str]

class AppConfigResponse(BaseModel):
    numInputPages: int
    pages: List[Page] # Only input pages here
    calculations: List[Calculation]
    outputPage: Optional[OutputPageOut]