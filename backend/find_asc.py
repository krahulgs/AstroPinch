
from services.vedic_astro_engine import VedicAstroEngine

def find_taurus():
    for h in range(18, 22):
        for m in [0, 15, 30, 45]:
            sd = VedicAstroEngine.calculate_sidereal_planets(1995, 10, 15, h, m, 23.67, 86.15, "Asia/Kolkata")
            asc = sd['ascendant']
            mars = next(p for p in sd['planets'] if p['name'] == 'Mars')
            print(f"{h:02d}:{m:02d} -> Asc: {asc['sign']} ({asc['longitude']:.2f}), Mars House: {mars['house']}")

if __name__ == "__main__":
    find_taurus()
