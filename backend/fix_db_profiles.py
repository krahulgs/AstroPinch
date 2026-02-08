
import sqlite3

def fix_profiles():
    conn = sqlite3.connect('astropinch.db')
    curr = conn.cursor()
    
    # Select profiles that are UTC but in India
    # India bounds approx: Lat 6 to 38, Lng 68 to 98
    curr.execute("""
        SELECT id, name, latitude, longitude, timezone_id 
        FROM profiles 
        WHERE timezone_id = 'UTC' 
    """)
    
    profiles = curr.fetchall()
    print(f"Found {len(profiles)} UTC profiles.")
    
    updated_count = 0
    for pid, name, lat, lng, tz in profiles:
        if lat and lng and 6.0 <= lat <= 38.0 and 68.0 <= lng <= 98.0:
            print(f"Fixing profile for {name} (Lat: {lat}, Lng: {lng}) -> Asia/Kolkata")
            curr.execute("""
                UPDATE profiles 
                SET timezone_id = 'Asia/Kolkata', utc_offset = 19800 
                WHERE id = ?
            """, (pid,))
            updated_count += 1
            
    conn.commit()
    conn.close()
    print(f"Updated {updated_count} profiles.")

if __name__ == "__main__":
    fix_profiles()
