
print("Starting verification...")
from services.vedic_astro_engine import VedicAstroEngine
import json
print("Imports done.")

def verify_fix():
    # Rahul Kumar Details
    name = "Rahul Kumar"
    year, month, day = 1976, 11, 12
    hour, minute = 18, 20
    lat, lng = 23.67, 86.15
    
    print(f"Verifying for {name} (Nov 12, 1976, 18:20, Bokaro)...")
    
    # 1. Manual check with Asia/Kolkata
    print("Calculating sidereal planets...")
    sd = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, "Asia/Kolkata")
    print("Sidereal planets calculated.")
    
    print("Calculating doshas...")
    doshas = VedicAstroEngine.calculate_doshas(sd)
    print("Doshas calculated.")
    
    present_doshas = [k for k, v in doshas.items() if v['present']]
    
    print("\nCalculated Doshas with Asia/Kolkata:")
    print(json.dumps(present_doshas, indent=4))
    
    # Check if Chandra Dosha is there
    if "chandra_dosha" in present_doshas:
        print("RESULT: Chandra Dosha is PRESENT.")
    else:
        print("RESULT: Chandra Dosha is ABSENT.")
        
    if "daridra_dosha" in present_doshas:
        print("RESULT: Daridra Dosha is PRESENT.")
    else:
        print("RESULT: Daridra Dosha is ABSENT.")

if __name__ == "__main__":
    verify_fix()
    print("Verification script finished.")
