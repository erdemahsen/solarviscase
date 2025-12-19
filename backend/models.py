from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from .database import Base

class AppConfig(Base):
    __tablename__ = "app_configs"

    id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String, default="My Solar Calc")
    
    # Relationship to pages
    pages = relationship("Page", back_populates="config", cascade="all, delete-orphan")
    # Relationship to calculations (Global now)
    calculations = relationship("Calculation", back_populates="config", cascade="all, delete-orphan")

###

class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    config_id = Column(Integer, ForeignKey("app_configs.id"))
    
    title = Column(String)
    description = Column(Text)
    image = Column(String) # Renamed from image_url
    order_index = Column(Integer)
    is_output_page = Column(Boolean, default=False)

    config = relationship("AppConfig", back_populates="pages")
    
    # Relationships to contents
    inputs = relationship("InputVariable", back_populates="page", cascade="all, delete-orphan")
    # Outputs removed from Page, moved to AppConfig as Calculations

###

class InputVariable(Base):
    __tablename__ = "input_variables"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"))
    
    name = Column(String) # Renamed from variable_name
    placeholder = Column(String) # Renamed from placeholder_text
    type = Column(String, default="number") # New field
    
    page = relationship("Page", back_populates="inputs")

class Calculation(Base): # Replaces OutputVariable, Global scope
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    config_id = Column(Integer, ForeignKey("app_configs.id"))
    
    outputName = Column(String) # e.g. "A"
    formula = Column(String) 
    unit = Column(String) 
    
    config = relationship("AppConfig", back_populates="calculations")