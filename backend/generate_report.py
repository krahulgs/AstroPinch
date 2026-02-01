import json
from services.kerykeion_engine import KerykeionService
from services.numerology_service import get_numerology_data
from services.astrology_aggregator import AstrologyAggregator

class ReportGenerator:
    @staticmethod
    def generate_consolidated_report(name, year, month, day, hour, minute, city, lat, lng, timezone="UTC", context=None, lang="en", gender="male"):
        print(f"Generating consolidated report for {name} ({lang}, {gender})...")
        
        # 1. Western Chart (Kerykeion) - DISABLED by User Request
        print("- Skipping Western Chart...")
        western_chart = None
        # western_chart = KerykeionService.calculate_chart(
        #     name, year, month, day, hour, minute, city, lat, lng, timezone, lang=lang
        # )

        # New: Western AI Summary (Simplified English) - DISABLED
        # try:
        #     if western_chart:
        #         from services.ai_service import generate_western_ai_summary
        #         western_chart['ai_summary'] = generate_western_ai_summary(
        #             name, 
        #             western_chart['sun_sign'], 
        #             western_chart['moon_sign'], 
        #             western_chart['ascendant'], 
        #             western_chart['planets'],
        #             houses=western_chart.get('houses'),
        #             context=context,
        #             lang=lang
        #         )
        #     else:
        #         print("⚠️ Warning: Western Chart could not be calculated. Skipping AI Summary.")
        #         western_chart = {"error": "Calculation Failed", "ai_summary": "Analysis currently unavailable."}
        # except Exception as e:
        #     print(f"Western AI Summary Error: {e}")
        #     western_chart['ai_summary'] = None
        
        # 2. Vedic/Kundali Analysis
        print("- Generating Vedic Analysis & Transits...")
        # Use new Vedic Engine for full report
        vedic_full = AstrologyAggregator.get_vedic_full_report(
            name, year, month, day, hour, minute, lat, lng, lang=lang, timezone=timezone, context=context
        )
        
        # Get Kundali SVG
        print("- Generating Vedic Chart SVG...")
        kundali_svg = AstrologyAggregator.get_kundali_svg(
            name, year, month, day, hour, minute, lat, lng, lang=lang
        )
        
        # Get Current Transits
        transits = AstrologyAggregator.get_current_transits(lat, lng)

        # New: Detailed Vedic Personality Analysis (Right Section)
        try:
            from services.ai_service import generate_vedic_chart_analysis
            vedic_personality_analysis = generate_vedic_chart_analysis(
                name, 
                vedic_full['planets'], 
                vedic_full['panchang'], 
                doshas=vedic_full.get('doshas', {}),
                lang=lang
            )
        except Exception as e:
            print(f"Vedic Personality Analysis Error: {e}")
            vedic_personality_analysis = None
        
        # New: Specific Career Analysis
        try:
            from services.ai_service import generate_career_analysis
            career_analysis = generate_career_analysis(
                name,
                vedic_full['planets'],
                vedic_full['panchang'],
                lang=lang
            )
        except Exception as e:
            print(f"Career Analysis Error: {e}")
            career_analysis = None

        # New: Specific Relationship Analysis
        try:
            from services.ai_service import generate_relationship_analysis
            relationship_analysis = generate_relationship_analysis(
                name,
                vedic_full['planets'],
                vedic_full['panchang'],
                lang=lang
            )
        except Exception as e:
            print(f"Relationship Analysis Error: {e}")
            relationship_analysis = None


        # 3. Numerology (Standard + Hilary Gerard + Groq AI + Loshu)
        # Now passing vedic_full and western_chart to get_numerology_data for AI context
        print("- Fetching Numerology Data (with Dual AI Context)...")
        numerology = get_numerology_data(name, year, month, day, vedic_data=vedic_full, western_data=western_chart, context=context, lang=lang, gender=gender)
        
        # 4. Best Prediction Aggregation
        print("- Aggregating Predictions...")
        predictions = AstrologyAggregator.get_aggregated_best_prediction(
            name, year, month, day, hour, minute, city, lat, lng, timezone,
            vedic_data=vedic_full,
            numerology_data=numerology,
            western_data=western_chart,
            context=context,
            lang=lang
        )
        # 5. Astrocartography (Locational Astrology)
        try:
            print("- Calculating Astrocartography Power Zones...")
            from services.astrocartography_engine import AstrocartographyEngine
            acg_locations = AstrocartographyEngine.calculate_power_zones(
                name, year, month, day, hour, minute
            )
        except Exception as e:
            print(f"Warning: Astrocartography failed: {e}")
            acg_locations = []

        # Extract Loshu Grid to move it to Vedic Astrology
        loshu_data = numerology.pop('loshu_grid', None)

        # Consolidate
        report = {
            "profile": {
                "name": name,
                "dob": f"{day}-{month}-{year}",
                "tob": f"{hour}:{minute}",
                "place": city,
                "coordinates": {"lat": lat, "lng": lng}
            },
            "numerology": numerology,
            "western_astrology": western_chart,
            "vedic_astrology": {
                "kundali_analysis": AstrologyAggregator.get_kundali_analysis(year, month, day, hour, minute, lat, lng, lang=lang),
                "planets": vedic_full['planets'], # Pass full sidereal planet positions
                "panchang": vedic_full['panchang'],
                "dasha": vedic_full['dasha'],
                "divisional_charts": vedic_full['divisional_charts'],
                "ayanamsa": vedic_full['ayanamsa'],
                "remedies": vedic_full['remedies'],
                "doshas": vedic_full.get('doshas', {}), # Add explicit doshas key
                "kp_system": vedic_full.get('kp_system'), 
                "kp_analysis": vedic_full.get('kp_analysis'), # Added this
                "kp_cusps": vedic_full.get('kp_cusps'),     # Added this
                "transits": transits,
                "graha_effects": vedic_full.get('graha_effects'),
                "ai_summary": vedic_full.get('ai_summary'),
                "chart_svg": kundali_svg,
                "loshu_grid": loshu_data,  # Moved here
                "vedic_personality_analysis": vedic_personality_analysis, # Added this
                "career_analysis": career_analysis, # Added this
                "relationship_analysis": relationship_analysis, # Added this
                "avakhada": vedic_full.get('avakhada') # New section
            },

            "astrocartography": acg_locations,
            "predictions_summary": predictions
        }
        
        return report

if __name__ == "__main__":
    print("ReportGenerator service loaded.")
