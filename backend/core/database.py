from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. THE URL
# For this project, we'll use SQLite because it's built into Python (easy for local dev).
# "sqlite:///./solarvis.db" means "create a file named solarvis.db in this folder"
SQLALCHEMY_DATABASE_URL = "sqlite:///./solarvis.db"

# 2. THE ENGINE (The Connection)
# check_same_thread=False is needed only for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. THE SESSION (The Transaction Maker)
# Each request (user logs in, saves a page) will create a new Session instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. THE BASE (The Catalog)
# All your models (User, Page, AppConfig) inherit from this class.
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
