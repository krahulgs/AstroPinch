
from services.vedic_astro_engine import VedicAstroEngine
import json

def verify_fix():
    # Rahul Kumar Details
    name = "Rahul Kumar"
    year, month, day = 1976, 11, 12
    hour, minute = 18, 20
    lat, lng = 23.67, 86.15
    
    # We want to ensure that with Asia/Kolkata, we get Daridra Dosha and NOT Chandra Dosha
    # And we want to ensure the system actually uses the timezone or the new fallback correctly.
    
    print(f"Verifying for {name} (Nov 12, 1976, 18:20, Bokaro)...")
    
    # 1. Manual check with Asia/Kolkata
    sd = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, "Asia/Kolkata")
    doshas = VedicAstroEngine.calculate_doshas(sd)
    
    present_doshas = [k for k, v in doshas.items() if v['present']]
    
    print("\nCalculated Doshas with Asia/Kolkata:")
    print(json.dumps(present_doshas, indent=4))
    
    # Check if Chandra Dosha is there
    if "chandra_dosha" in present_doshas:
        print("ERROR: Chandra Dosha is still present!")
    else:
        print("SUCCESS: Chandra Dosha is ABSENT.")
        
    if "daridra_dosha" in present_doshas:
        print("SUCCESS: Daridra Dosha is PRESENT (as expected).")
    else:
        print("WARNING: Daridra Dosha is absent. Re-check logic.")

if __name__ == "__main__":
    verify_fix()
