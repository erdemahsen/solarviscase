from pydantic import BaseModel
from typing import List, Optional

# ==========================================
# 1. INPUT VARIABLES
# ==========================================

class InputVariableBase(BaseModel):
    variable_name: str
    placeholder: Optional[str] = None

class InputVariableCreate(InputVariableBase):
    pass

# NEW: Used for the Bulk Update
class InputVariableUpdate(InputVariableBase):
    id: Optional[int] = None

class InputVariable(InputVariableBase):
    id: int
    page_id: int

    class Config:
        from_attributes = True


# ==========================================
# 2. CALCULATIONS 
# ==========================================

class CalculationBase(BaseModel):
    output_name: str
    formula: str
    unit: Optional[str] = None

class CalculationCreate(CalculationBase):
    pass

# NEW: Used for the Bulk Update
class CalculationUpdate(CalculationBase):
    id: Optional[int] = None

class Calculation(CalculationBase):
    id: int
    page_id: int

    class Config:
        from_attributes = True


# ==========================================
# 3. PAGES 
# ==========================================

class PageBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    order_index: int = 0

class PageCreate(PageBase):
    inputs: List[InputVariableCreate] = []
    calculations: List[CalculationCreate] = []

# NEW: The "Heavy" Update Schema
class PageFullUpdate(PageBase):
    id: Optional[int] = None
    # Notice we use the Update versions here, not Create
    inputs: List[InputVariableUpdate] = []
    calculations: List[CalculationUpdate] = []

class Page(PageBase):
    id: int
    config_id: int
    inputs: List[InputVariable] = []
    calculations: List[Calculation] = []

    class Config:
        from_attributes = True


# ==========================================
# 4. APP CONFIG 
# ==========================================

class AppConfigBase(BaseModel):
    app_name: str = "My Solar Calc"

class AppConfigCreate(AppConfigBase):
    pass

# NEW: The payload you send when clicking "Save"
class AppConfigUpdate(AppConfigBase):
    pages: List[PageFullUpdate] = []

class AppConfig(AppConfigBase):
    id: int
    pages: List[Page] = []

    class Config:
        from_attributes = True


# ==========================================
# 5. USER & AUTH
# ==========================================

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
