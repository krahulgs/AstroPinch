import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.astrology_aggregator import AstrologyAggregator

try:
    report = AstrologyAggregator.get_vedic_full_report(
        name="Test",
        year=1990,
        month=1,
        day=1,
        hour=12,
        minute=0,
        lat=28.6,
        lng=77.2,
        timezone="Asia/Kolkata"
    )
    print("Report generated successfully")
    print("Dosha check content:", report['ai_summary']['dosha_check']['content'])
except Exception as e:
    print(f"Error: {e}")
