
from generate_report import ReportGenerator
import json
import sys

# Rahul Kumar Details
# Date: 12 Nov 1976
# Time: 18:20
# Place: Bokaro (23.67, 86.15)
# Timezone: Asia/Kolkata

def test_rahul_report():
    print("Generating report for Rahul Kumar...")
    try:
        report = ReportGenerator.generate_consolidated_report(
            name="Rahul Kumar",
            year=1976,
            month=11,
            day=12,
            hour=18,
            minute=20,
            city="Bokaro",
            lat=23.67,
            lng=86.15,
            timezone="Asia/Kolkata",
            lang="en",
            gender="male"
        )
        
        doshas = report['vedic_astrology']['doshas']
        print("\n--- FINAL DOSHA REPORT FOR RAHUL KUMAR ---")
        print(json.dumps(doshas, indent=2))
        
        # Check specific expected values
        if doshas['pitru_dosha']['present'] == True:
            print("\nSUCCESS: Pitru Dosha correctly detected.")
        else:
            print("\nFAILURE: Pitru Dosha NOT detected.")
            
        return report
    except Exception as e:
        print(f"Error generating report: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_rahul_report()
