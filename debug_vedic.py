
import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.astrology_aggregator import AstrologyAggregator
import json

def debug_vedic():
    name = "David John"
    year, month, day = 1977, 11, 12
    hour, minute = 18, 20
    lat, lng = 30.3165, 78.0322
    
    print("Fetching Vedic Full Report...")
    report = AstrologyAggregator.get_vedic_full_report(name, year, month, day, hour, minute, lat, lng)
    
    print("Vedic Report Keys:", report.keys())
    if "graha_effects" in report:
        print(f"Found {len(report['graha_effects'])} graha effects.")
        print(json.dumps(report['graha_effects'][:2], indent=2))
    else:
        print("CRITICAL: graha_effects NOT in report!")

if __name__ == "__main__":
    debug_vedic()
