
from generate_report import ReportGenerator
import json

def debug_report():
    # User-like data (Match Manglik in House 7)
    # 20:00 IST on Oct 15, 1995 fits the "Mars in House 7" description
    details = {
        "name": "User",
        "year": 1995, "month": 10, "day": 15,
        "hour": 20, "minute": 0,
        "lat": 23.67, "lng": 86.15,
        "city": "Bokaro",
        "timezone": "Asia/Kolkata"
    }
    
    report = ReportGenerator.generate_consolidated_report(
        details['name'], details['year'], details['month'], details['day'],
        details['hour'], details['minute'], details['city'],
        details['lat'], details['lng'], timezone=details['timezone']
    )
    
    doshas = report['vedic_astrology']['doshas']
    print(f"\nReport Generated for {details['hour']}:{details['minute']}")
    print(f"Manglik: {doshas['manglik']['present']} ({doshas['manglik']['reason']})")
    print(f"Pitru Dosha: {doshas['pitru_dosha']['present']} ({doshas['pitru_dosha'].get('reason')})")
    print(f"Grahan Dosha: {doshas['grahan_dosha']['present']} ({doshas['grahan_dosha'].get('reason')})")
    print(f"Kaal Sarp: {doshas['kaal_sarp']['present']} ({doshas['kaal_sarp'].get('reason')})")

if __name__ == "__main__":
    debug_report()
