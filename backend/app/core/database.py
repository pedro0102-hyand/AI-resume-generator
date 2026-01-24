from sqlalchemy import create_engine
from sqlalchemy import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./resume.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thereas": False})

sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()