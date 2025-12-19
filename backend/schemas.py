from pydantic import BaseModel
from typing import List, Optional

# ==========================================
# 1. INPUT VARIABLES (The Bottom Layer)
# ==========================================

class InputVariableBase(BaseModel):
    variable_name: str
    placeholder: Optional[str] = None
    input_type: str = "number"

class InputVariableCreate(InputVariableBase):
    pass

class InputVariable(InputVariableBase):
    id: int
    page_id: int

    class Config:
        from_attributes = True


# ==========================================
# 2. CALCULATIONS (The Bottom Layer)
# ==========================================

class CalculationBase(BaseModel):
    output_name: str
    formula: str
    unit: Optional[str] = None

class CalculationCreate(CalculationBase):
    pass

class Calculation(CalculationBase):
    id: int
    page_id: int

    class Config:
        from_attributes = True


# ==========================================
# 3. PAGES (The Middle Layer - UNIFIED)
# ==========================================

class PageBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    order_index: int = 0

class PageCreate(PageBase):
    # This allows you to create a page AND its contents in one API call
    inputs: List[InputVariableCreate] = []
    calculations: List[CalculationCreate] = []

class Page(PageBase):
    id: int
    config_id: int
    
    # The Magic: A page can have both!
    inputs: List[InputVariable] = []
    calculations: List[Calculation] = []

    class Config:
        from_attributes = True


# ==========================================
# 4. APP CONFIG (The Top Layer)
# ==========================================

class AppConfigBase(BaseModel):
    app_name: str = "My Solar Calc"

class AppConfigCreate(AppConfigBase):
    pass

class AppConfig(AppConfigBase):
    id: int
    
    # Returns all pages, sorted by order_index automatically if you handle it in CRUD
    pages: List[Page] = []

    class Config:
        from_attributes = True