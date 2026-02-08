
from services.vedic_astro_engine import VedicAstroEngine
from services.dosha_calculator import DoshaCalculator

def verify():
    # Deepa Kumari refined coords
    # 30 Sept 2004, 7:03 PM (19:03)
    # Patan, Palamu: 24.184 N, 84.225 E
    lat, lng = 24.184, 84.225
    
    sid = VedicAstroEngine.calculate_sidereal_planets(
        2004, 9, 30, 19, 3, lat, lng, timezone_str="Asia/Kolkata"
    )
    
    rahu = next(p for p in sid['planets'] if p['name'] == 'Rahu')
    moon = next(p for p in sid['planets'] if p['name'] == 'Moon')
    
    print(f"Rahu: {rahu['sidereal_longitude']}")
    print(f"Moon: {moon['sidereal_longitude']}")
    
    doshas = DoshaCalculator.calculate_doshas(sid)
    print(f"Kaal Sarp Present: {doshas['kaal_sarp']['present']}")
    print(f"Reason: {doshas['kaal_sarp']['reason']}")

if __name__ == '__main__':
    verify()
