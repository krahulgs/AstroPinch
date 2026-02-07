import json
from services.kerykeion_engine import KerykeionService
from services.numerology_service import get_numerology_data
from services.astrology_aggregator import AstrologyAggregator

class ReportGenerator:
    @staticmethod
    def generate_consolidated_report(name, year, month, day, hour, minute, city, lat, lng, timezone="UTC", context=None, lang="en", gender="male"):
        from concurrent.futures import ThreadPoolExecutor
        from datetime import datetime

        print(f"Generating consolidated report for {name} ({lang}, {gender})...")
        
        # 1. Western Chart (Kerykeion) - DISABLED by User Request
        western_chart = None

        with ThreadPoolExecutor() as executor:
            # Parallel Task 1: Vedic Analysis
            print("- Starting Vedic Analysis & Transits (Parallel)...")
            vedic_future = executor.submit(
                AstrologyAggregator.get_vedic_full_report,
                name, year, month, day, hour, minute, lat, lng, lang=lang, timezone=timezone, context=context
            )
            
            # Parallel Task 2: Numerology (Standard + Hilary Gerard + Loshu)
            print("- Starting Numerology Data Fetch (Parallel)...")
            numerology_future = executor.submit(
                get_numerology_data,
                name, year, month, day, context=context, lang=lang, gender=gender
            )
            
            # Parallel Task 3: Astrocartography
            print("- Calculating Astrocartography (Parallel)...")
            from services.astrocartography_engine import AstrocartographyEngine
            acg_future = executor.submit(
                AstrocartographyEngine.calculate_power_zones,
                name, year, month, day, hour, minute
            )

            # Wait for base data to be ready
            vedic_full = vedic_future.result()
            numerology = numerology_future.result()
            try:
                acg_locations = acg_future.result()
            except Exception as e:
                print(f"Warning: Astrocartography failed: {e}")
                acg_locations = []

        # 2. Detailed AI Analyses (Parallelizing the dependent AI calls)
        print("- Starting AI Synthesis Layer (Parallel)...")
        with ThreadPoolExecutor() as executor:
            from services.ai_service import generate_vedic_chart_analysis, generate_relationship_analysis
            
            # Rough age calculation
            birth_date = datetime(year, month, day)
            today = datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

            # Personality Analysis Future
            personality_future = executor.submit(
                generate_vedic_chart_analysis,
                name, vedic_full['planets'], vedic_full['panchang'], 
                doshas=vedic_full.get('doshas', {}), lang=lang,
                dob=f"{day}-{month}-{year}", place=city, age=age
            )

            # Relationship Analysis Future
            relationship_future = executor.submit(
                generate_relationship_analysis,
                name, vedic_full['planets'], vedic_full['panchang'], lang=lang
            )

            # Best Prediction / Executive Summary Future
            prediction_future = executor.submit(
                AstrologyAggregator.get_aggregated_best_prediction,
                name, year, month, day, hour, minute, city, lat, lng, timezone,
                vedic_data=vedic_full, numerology_data=numerology,
                western_data=western_chart, context=context, lang=lang
            )

            # Parallel Task for SVG and Analysis (Non-AI but separate)
            svg_future = executor.submit(
                AstrologyAggregator.get_kundali_svg,
                name, year, month, day, hour, minute, lat, lng, lang=lang
            )

            # Collect AI Results
            try:
                vedic_personality_analysis = personality_future.result()
            except Exception as e:
                print(f"Personality AI Error: {e}")
                vedic_personality_analysis = None

            try:
                relationship_analysis = relationship_future.result()
            except Exception as e:
                print(f"Relationship AI Error: {e}")
                relationship_analysis = None

            try:
                predictions = prediction_future.result()
            except Exception as e:
                print(f"Predictions AI Error: {e}")
                predictions = None

            try:
                kundali_svg = svg_future.result()
            except Exception as e:
                print(f"SVG Error: {e}")
                kundali_svg = None

        # Extract Loshu Grid to move it to Vedic Astrology
        loshu_data = numerology.pop('loshu_grid', None)
        transits = vedic_full.get('transits', []) # Already calculated in get_vedic_full_report

        # Generate KP Event Predictions
        print("- Generating KP Event Predictions...")
        from services.kp_prediction_service import KPPredictionService
        try:
            kp_predictions = KPPredictionService.generate_event_predictions(
                kp_cusps=vedic_full.get('kp_cusps'),
                kp_system_data=vedic_full.get('kp_system'),
                dasha_data=vedic_full.get('dasha'),
                lang=lang
            )
        except Exception as e:
            print(f"KP Predictions Error: {e}")
            kp_predictions = {"predictions": []}

        # Consolidate
        report = {
            "profile": {
                "name": name,
                "dob": f"{day}-{month}-{year}",
                "tob": f"{hour}:{minute}",
                "place": city,
                "coordinates": {"lat": lat, "lng": lng}
            },
            "numerology": {
                **numerology,
                "loshu_grid": loshu_data
            },
            "western_astrology": western_chart,
            "vedic_astrology": {
                "kundali_analysis": vedic_full.get('kundali_analysis'), # Avoid redundant calculation
                "planets": vedic_full['planets'],
                "panchang": vedic_full['panchang'],
                "dasha": vedic_full['dasha'],
                "divisional_charts": vedic_full['divisional_charts'],
                "ayanamsa": vedic_full['ayanamsa'],
                "remedies": vedic_full['remedies'],
                "doshas": vedic_full.get('doshas', {}),
                "kp_system": vedic_full.get('kp_system'), 
                "kp_analysis": vedic_full.get('kp_analysis'),
                "kp_cusps": vedic_full.get('kp_cusps'),
                "transits": transits,
                "graha_effects": vedic_full.get('graha_effects'),
                "ai_summary": vedic_full.get('ai_summary'),
                "chart_svg": kundali_svg,
                "vedic_personality_analysis": vedic_personality_analysis,
                "career_analysis": None, # career_analysis disabled as per original
                "relationship_analysis": relationship_analysis,
                "avakhada": vedic_full.get('avakhada')
            },
            "astrocartography": acg_locations,
            "predictions_summary": predictions,
            "kp_analysis": kp_predictions  # Add KP predictions at root level for frontend
        }
        
        return report

if __name__ == "__main__":
    print("ReportGenerator service loaded.")
