import math

class KundaliPainter:
    COLORS = {
        "bg": "#ffffff", # White background for high contrast
        "border": "#000000", # Black border
        "line": "#000000", # Black lines
        "accent": "#000000", # Black accent text
        "text": "#000000", # Black title text
        "planets": {
            "Sun": "#dc2626", "Moon": "#2563eb", # Red/Blue for visibility
            "Mercury": "#059669", "Venus": "#db2777", 
            "Mars": "#dc2626", "Jupiter": "#ca8a04", 
            "Saturn": "#4b5563", "Rahu": "#4b5563", "Ketu": "#4b5563"
        }
    }

    @staticmethod
    def draw_north_indian_chart(planets, chart_title="Vedic Kundli", lang="en", ascendant_sign=1):
        # Localized Planet Labels
        planet_labels = {
            "en": {"Sun": "SU", "Moon": "MO", "Mercury": "ME", "Venus": "VE", "Mars": "MA", "Jupiter": "JU", "Saturn": "SA", "Uranus": "UR", "Neptune": "NE", "Pluto": "PL"},
            "hi": {"Sun": "सू", "Moon": "चं", "Mercury": "बु", "Venus": "शु", "Mars": "मं", "Jupiter": "गु", "Saturn": "श", "Uranus": "यू", "Neptune": "ने", "Pluto": "प्ल"},
            "es": {"Sun": "SO", "Moon": "LU", "Mercury": "ME", "Venus": "VE", "Mars": "MA", "Jupiter": "JU", "Saturn": "SA", "Uranus": "UR", "Neptune": "NE", "Pluto": "PL"},
            "fr": {"Sun": "SO", "Moon": "LU", "Mercury": "ME", "Venus": "VE", "Mars": "MA", "Jupiter": "JU", "Saturn": "SA", "Uranus": "UR", "Neptune": "NE", "Pluto": "PL"}
        }
        labels = planet_labels.get(lang, planet_labels["en"])

        # North Indian chart is a square with diagonal lines forming a diamond
        size = 400
        padding = 10
        inner_size = size - 2 * padding
        
        svg = [f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">']
        
        # 1. Background and Outer Square
        svg.append(f'<rect x="{padding}" y="{padding}" width="{inner_size}" height="{inner_size}" fill="{KundaliPainter.COLORS["bg"]}" stroke="{KundaliPainter.COLORS["border"]}" stroke-width="2" />')
        
        # 2. Main Diagonals (forming the central diamond)
        svg.append(f'<line x1="{padding}" y1="{padding}" x2="{size-padding}" y2="{size-padding}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1.5" />')
        svg.append(f'<line x1="{padding}" y1="{size-padding}" x2="{size-padding}" y2="{padding}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1.5" />')
        
        # 3. Inner Diamond Square
        mid = size / 2
        svg.append(f'<line x1="{mid}" y1="{padding}" x2="{padding}" y2="{mid}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1.5" />')
        svg.append(f'<line x1="{padding}" y1="{mid}" x2="{mid}" y2="{size-padding}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1.5" />')
        svg.append(f'<line x1="{mid}" y1="{size-padding}" x2="{size-padding}" y2="{mid}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1.5" />')
        svg.append(f'<line x1="{size-padding}" y1="{mid}" x2="{mid}" y2="{padding}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1.5" />')

        # 4. House Definitions (Centers for text placement in North Indian chart)
        house_centers = {
            1: (mid, mid - 60), # Top diamond center
            2: (mid - 60, padding + 30),
            3: (padding + 30, mid - 60),
            4: (mid - 60, mid),
            5: (padding + 30, mid + 60),
            6: (mid - 60, size - padding - 30),
            7: (mid, mid + 60),
            8: (mid + 60, size - padding - 30),
            9: (size - padding - 30, mid + 60),
            10: (mid + 60, mid),
            11: (size - padding - 30, mid - 60),
            12: (mid + 60, padding + 30)
        }

        # 5. Place House Markers (Traditional Sanskrit Glyphs style)
        # In North Indian Chart, the numbers represent SIGNS (Rashis), not Houses.
        # House 1 is always Top Diamond.
        for h, (cx, cy) in house_centers.items():
            # Calculate Sign Number to display
            # House 1 = Ascendant Sign
            # House 2 = Ascendant Sign + 1
            sign_num = (ascendant_sign + (h - 1) - 1) % 12 + 1
            svg.append(f'<text x="{cx}" y="{cy}" fill="{KundaliPainter.COLORS["accent"]}" font-size="9" font-family="Georgia, serif" opacity="0.6" text-anchor="middle">{sign_num}</text>')

        # 6. Group Planets by House
        planets_by_house = {}
        for p in planets:
            # Include all planets as per user request
            # if p['name'] in ["Uranus", "Neptune", "Pluto"]: continue
            h = p.get('house', 1)
            if h not in planets_by_house: planets_by_house[h] = []
            planets_by_house[h].append(p)

        # 7. Render Planets in Houses
        for h, house_planets in planets_by_house.items():
            cx, cy = house_centers.get(h, (mid, mid))
            for i, p in enumerate(house_planets):
                offset_y = (i * 14) + 16 # More spacing
                p_label = labels.get(p['name'], p['name'][:2].upper())
                p_color = KundaliPainter.COLORS['planets'].get(p['name'], "#fff")
                
                # Check for Retrograde
                is_retro = p.get('retrograde', False)
                ret_mark = "(R)" if is_retro else ""
                
                svg.append(f'<text x="{cx}" y="{cy + offset_y}" fill="{p_color}" font-size="12" font-weight="bold" text-anchor="middle" font-family="Georgia, serif">{p_label}{ret_mark}</text>')

        # 8. Title (Traditional Calligraphy feel)
        svg.append(f'<text x="{mid}" y="{size - 5}" fill="{KundaliPainter.COLORS["text"]}" font-size="14" font-weight="black" text-anchor="middle" font-family="Georgia, serif" letter-spacing="2">{chart_title.upper()}</text>')

        svg.append('</svg>')
        return "".join(svg)
