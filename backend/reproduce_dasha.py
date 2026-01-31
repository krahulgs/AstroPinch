from services.vedic_astro_engine import VedicAstroEngine
from datetime import datetime
import json

def test_dasha():
    # Test case: Born 1990-01-01 12:00:00 UTC at 0,0
    print("Testing Vimshottari Dasha calculation...")
    
    try:
        # Using a standard date
        year, month, day = 1990, 1, 1
        hour, minute = 12, 0
        lat, lng = 28.6139, 77.2090 # New Delhi
        
        dasha = VedicAstroEngine.calculate_vimshottari_dasha(year, month, day, hour, minute, lat, lng)
        
        print("\n--- Result ---")
        print(json.dumps(dasha, indent=2, default=str))
        
        if dasha['active_mahadasha']:
             print(f"\nSUCCESS: Active Mahadasha Found: {dasha['active_mahadasha']}")
        else:
             print("\nFAILURE: No Active Mahadasha Found")
             
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_dasha()
