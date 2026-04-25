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
    @staticmethod
    def draw_south_indian_chart(planets, chart_title="Vedic Kundli", lang="en", ascendant_sign=1):
        """
        South Indian style chart: Fixed signs in a square grid.
        Clockwise from Top-Left: Aries starts at cell index 1.
        Grid Layout (4x4):
        [11, 0, 1, 2]  (Pis, Ari, Tau, Gem)
        [10,  ,  , 3]  (Aqu,        , Can)
        [ 9,  ,  , 4]  (Cap,        , Leo)
        [ 8, 7, 6, 5]  (Sag, Sco, Lib, Vir)
        """
        planet_labels = {
            "en": {"Sun": "SU", "Moon": "MO", "Mercury": "ME", "Venus": "VE", "Mars": "MA", "Jupiter": "JU", "Saturn": "SA", "Rahu": "RA", "Ketu": "KE"},
            "hi": {"Sun": "सू", "Moon": "चं", "Mercury": "बु", "Venus": "शु", "Mars": "मं", "Jupiter": "गु", "Saturn": "श", "Rahu": "रा", "Ketu": "के"},
            "ta": {"Sun": "சூ", "Moon": "சந்", "Mercury": "பு", "Venus": "சு", "Mars": "செ", "Jupiter": "கு", "Saturn": "ச", "Rahu": "ராகு", "Ketu": "கேது"},
            "te": {"Sun": "ర", "Moon": "చం", "Mercury": "బు", "Venus": "శు", "Mars": "మం", "Jupiter": "గు", "Saturn": "శ", "Rahu": "రా", "Ketu": "కే"},
            "mr": {"Sun": "सू", "Moon": "चं", "Mercury": "बु", "Venus": "शु", "Mars": "मं", "Jupiter": "गु", "Saturn": "श", "Rahu": "रा", "Ketu": "के"}
        }
        labels = planet_labels.get(lang, planet_labels["en"])

        size = 400
        padding = 10
        cell_size = (size - 2 * padding) / 4
        
        svg = [f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">']
        svg.append(f'<rect x="{padding}" y="{padding}" width="{size-2*padding}" height="{size-2*padding}" fill="{KundaliPainter.COLORS["bg"]}" stroke="{KundaliPainter.COLORS["border"]}" stroke-width="2" />')

        # Cell Mappings (Sign Index to Grid X,Y)
        # 0=Aries, 1=Taurus, ... 11=Pisces
        sign_to_grid = {
            0: (1, 0), 1: (2, 0), 2: (3, 0), 3: (3, 1),
            4: (3, 2), 5: (3, 3), 6: (2, 3), 7: (1, 3),
            8: (0, 3), 9: (0, 2), 10: (0, 1), 11: (0, 0)
        }

        # Draw Grid Lines
        for i in range(1, 4):
            # Horizontal lines
            svg.append(f'<line x1="{padding}" y1="{padding + i*cell_size}" x2="{size-padding}" y2="{padding + i*cell_size}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1" />')
            # Vertical lines
            svg.append(f'<line x1="{padding + i*cell_size}" y1="{padding}" x2="{padding + i*cell_size}" y2="{size-padding}" stroke="{KundaliPainter.COLORS["line"]}" stroke-width="1" />')

        # Clear middle 2x2
        inner_start = padding + cell_size
        inner_end = padding + 3 * cell_size
        svg.append(f'<rect x="{inner_start+1}" y="{inner_start+1}" width="{2*cell_size-2}" height="{2*cell_size-2}" fill="{KundaliPainter.COLORS["bg"]}" />')

        # Draw Ascendant Marker (Lagna)
        asc_idx = (ascendant_sign - 1) % 12
        grid_x, grid_y = sign_to_grid[asc_idx]
        svg.append(f'<line x1="{padding + grid_x*cell_size}" y1="{padding + grid_y*cell_size}" x2="{padding + (grid_x+1)*cell_size}" y2="{padding + (grid_y+1)*cell_size}" stroke="{KundaliPainter.COLORS["accent"]}" stroke-width="0.5" opacity="0.3" />')
        svg.append(f'<text x="{padding + grid_x*cell_size + 5}" y="{padding + grid_y*cell_size + 15}" fill="{KundaliPainter.COLORS["accent"]}" font-size="10" font-weight="black" opacity="0.8">AS</text>')

        # Group Planets by Sign
        planets_by_sign = {}
        # In South Indian chart, planets stay in their signs.
        # We need the sign index.
        for p in planets:
            # We assume p has 'sign' name or 'sign_id'
            # Let's use a robust way to get sign index 0-11
            sign_names = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            try:
                if 'sign' in p and p['sign'] in sign_names:
                    s_idx = sign_names.index(p['sign'])
                else:
                    # Fallback to house relative to Lagna if sign not present
                    s_idx = (asc_idx + p.get('house', 1) - 1) % 12
            except:
                s_idx = 0
            
            if s_idx not in planets_by_sign: planets_by_sign[s_idx] = []
            planets_by_sign[s_idx].append(p)

        # Render Planets
        for s_idx, house_planets in planets_by_sign.items():
            gx, gy = sign_to_grid[s_idx]
            cx = padding + gx * cell_size + cell_size / 2
            cy = padding + gy * cell_size + 20
            
            for i, p in enumerate(house_planets):
                offset_y = i * 15
                p_label = labels.get(p['name'], p['name'][:2].upper())
                p_color = KundaliPainter.COLORS['planets'].get(p['name'], "#000")
                is_retro = p.get('retrograde', False)
                ret_mark = "R" if is_retro else ""
                
                svg.append(f'<text x="{cx}" y="{cy + offset_y}" fill="{p_color}" font-size="11" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">{p_label}{ret_mark}</text>')

        # Center Title
        svg.append(f'<text x="{size/2}" y="{size/2 - 10}" fill="{KundaliPainter.COLORS["text"]}" font-size="16" font-weight="black" text-anchor="middle" font-family="Georgia, serif">{chart_title.upper()}</text>')
        svg.append(f'<text x="{size/2}" y="{size/2 + 15}" fill="{KundaliPainter.COLORS["accent"]}" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" opacity="0.6">South Indian Style</text>')

        svg.append('</svg>')
        return "".join(svg)

    @staticmethod
    def draw_chart(planets, style="north", chart_title="Vedic Kundli", lang="en", ascendant_sign=1):
        if style.lower() == "south":
            return KundaliPainter.draw_south_indian_chart(planets, chart_title, lang, ascendant_sign)
        return KundaliPainter.draw_north_indian_chart(planets, chart_title, lang, ascendant_sign)
