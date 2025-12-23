from pydantic import BaseModel, Field
from typing import List, Optional

# ==========================================
# 1. INPUT VARIABLES
# ==========================================

class InputVariableBase(BaseModel):
    variable_name: str = Field(..., description="Unique identifier for the variable", examples=["X"])
    placeholder: Optional[str] = Field(None, description="Text that explains what that variable is", examples=["Ev yaşı"])

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
    output_name: str = Field(..., description="Name of the result variable", examples=["Satış Fiyatı"])
    formula: str = Field(..., description="Mathematical expression to calculate the value", examples=["(Y * 100000 + Z * 50000 ) -( X * 10000 )"])
    unit: Optional[str] = Field(None, description="Unit of the calculation result", examples=["TL"])

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
    title: str = Field(..., description="Title displayed on the page", examples=["Eviniz kaç yıllık ?"])
    description: Optional[str] = Field(None, description="Description of the page", examples=["Evinizin kaç yıllık olduğunu giriniz."])
    image_url: Optional[str] = Field(None, description="URL of the page image", examples=["static/uploads/7cd0b702-471d-4f9c-be55-10a1263eed48.jpeg"])
    order_index: int = Field(0, description="Order index of the page", examples=[1])

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
    app_name: str = Field("My Solar Calc", description="Name of the application", examples=["Ev Fiyat Hesaplama"])

class AppConfigCreate(AppConfigBase):
    pass

class AppConfigUpdate(AppConfigBase):
    pages: List[PageFullUpdate] = [] 

    class Config:
        json_schema_extra = {
            "example": {
                "app_name": "Ev Fiyat Hesaplama",
                "pages": [
                    {
                        "id": 1,
                        "title": "Eviniz kaç yıllık ?",
                        "description": "Evinizin kaç yıllık olduğunu giriniz.",
                        "image_url": "static/uploads/7cd0b702-471d-4f9c-be55-10a1263eed48.jpeg",
                        "order_index": 0,
                        "inputs": [
                            {
                                "id": 1,
                                "variable_name": "X",
                                "placeholder": "Ev yaşı"
                            }
                        ],
                        "calculations": []
                    },
                    {
                        "title": "Evin hangi yılda inşa edildi",
                        "description": "Bu sayfada evinin kaç yılında inşa edildiğini bulacağız.",
                        "image_url": "",
                        "order_index": 1,
                        "inputs": [],
                        "calculations": [
                            {
                                "output_name": "Yıl",
                                "formula": "2025-X",
                                "unit": ""
                            }
                        ]
                    }
                ]
            }
        }

class AppConfig(AppConfigBase):
    id: int
    pages: List[Page] = []

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "app_name": "Ev Fiyat Hesaplama",
                "id": 1,
                "pages": [
                    {
                        "title": "Eviniz kaç yıllık ?",
                        "description": "Evinizin kaç yıllık olduğunu giriniz.",
                        "image_url": "static/uploads/7cd0b702-471d-4f9c-be55-10a1263eed48.jpeg",
                        "order_index": 0,
                        "id": 1,
                        "config_id": 1,
                        "inputs": [
                            {
                                "variable_name": "X",
                                "placeholder": "Ev yaşı",
                                "id": 1,
                                "page_id": 1
                            }
                        ],
                        "calculations": []
                    },
                    {
                        "title": "Evinizde kaç oda ve banyo var?",
                        "description": "Eviniz hakkında aşağıdaki detayları doldurun.",
                        "image_url": "static/uploads/b04eb5f8-836e-4e4a-bddd-a72912f4aa0d.jpg",
                        "order_index": 1,
                        "id": 2,
                        "config_id": 1,
                        "inputs": [
                            {
                                "variable_name": "Y",
                                "placeholder": "Oda sayısı",
                                "id": 2,
                                "page_id": 2
                            },
                            {
                                "variable_name": "Z",
                                "placeholder": "Banyo sayısı",
                                "id": 3,
                                "page_id": 2
                            }
                        ],
                        "calculations": []
                    },
                    {
                        "title": "Evinizin yaklaşık satış fiyatı ve kira değeri",
                        "description": "Evinizin yaklaşık satış fiyatı ve kira değeri aşağıda hesaplanmıştır.",
                        "image_url": "static/uploads/5ba0d73a-7711-4be7-b24d-891da1b0c3d6.png",
                        "order_index": 2,
                        "id": 3,
                        "config_id": 1,
                        "inputs": [],
                        "calculations": [
                            {
                                "output_name": "Satış Fiyatı",
                                "formula": "(Y * 100000 + Z * 50000 ) -( X * 10000 )",
                                "unit": "TL",
                                "id": 1,
                                "page_id": 3
                            },
                            {
                                "output_name": "Kira Değeri",
                                "formula": "((Y * 100000 + Z * 50000 ) -( X * 10000 )) / 200",
                                "unit": "TL",
                                "id": 2,
                                "page_id": 3
                            }
                        ]
                    }
                ]
            }
        }


# ==========================================
# 5. USER & AUTH
# ==========================================

class UserBase(BaseModel):
    email: str = Field(..., description="User's email address", examples=["test@example.com"])

class UserCreate(UserBase):
    password: str = Field(..., description="User's password", examples=["password123"])

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
