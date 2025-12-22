from sqlalchemy import Column, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from .core.database import Base

class AppConfig(Base):
    __tablename__ = "app_configs"

    id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String, default="My Solar Calc")
    
    # ONE relationship to rule them all. 
    # The pages list will contain Page 1, Page 2, and the Final Page.
    pages = relationship("Page", back_populates="config", cascade="all, delete-orphan")


class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    config_id = Column(Integer, ForeignKey("app_configs.id"))
    
    title = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    order_index = Column(Integer, default=0) # Important to keep the order (1, 2, 3...)
    

    config = relationship("AppConfig", back_populates="pages")
    
    # NOW A PAGE CAN HAVE BOTH:
    inputs = relationship("InputVariable", back_populates="page", cascade="all, delete-orphan")
    calculations = relationship("Calculation", back_populates="page", cascade="all, delete-orphan")


class InputVariable(Base):
    __tablename__ = "input_variables"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    
    variable_name = Column(String, nullable=False) # e.g. "X"
    placeholder = Column(String)
    
    page = relationship("Page", back_populates="inputs")


class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Changed: Now points to 'pages.id', not 'output_pages.id'
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    
    output_name = Column(String, nullable=False) # "Total Cost"
    formula = Column(String, nullable=False)     # "X + Y"
    unit = Column(String)                        # "$"
    
    page = relationship("Page", back_populates="calculations")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
