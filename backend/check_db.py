
from database import SessionLocal
from models import Profile
import sys

def check_db():
    try:
        db = SessionLocal()
        p = db.query(Profile).order_by(Profile.created_at.desc()).first()
        if p:
            print(f"DEBUG DB: Profile Name: {p.name}")
            print(f"DEBUG DB: Lat: {p.latitude}, Lng: {p.longitude}")
            print(f"DEBUG DB: Birth: {p.birth_date} {p.birth_time}")
            print(f"DEBUG DB: Timezone: {p.timezone_id}")
        else:
            print("DEBUG DB: No profiles found.")
    except Exception as e:
        print(f"DEBUG DB ERROR: {e}")

if __name__ == "__main__":
    check_db()
