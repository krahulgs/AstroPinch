import json
from services.kerykeion_engine import KerykeionService
from services.numerology_service import get_numerology_data
from services.astrology_aggregator import AstrologyAggregator

class ReportGenerator:
    @staticmethod
    async def generate_consolidated_report(name, year, month, day, hour, minute, city, lat, lng, timezone=None, context=None, lang="en", gender="male"):
        import asyncio
        from datetime import datetime

        print(f"Generating consolidated report for {name} ({lang}, {gender})...")
        
        # 1. Western Chart (Kerykeion) - DISABLED by User Request
        western_chart = None

        # Rough age calculation early
        birth_date = datetime(year, month, day)
        today = datetime.now()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

        # Update context with age
        if context is None: context = {}
        context['age'] = age

        # 1. Base Data Fetching (Use to_thread for sync functions to keep them parallelized)
        print(f"- Starting Base Data Fetch (Vedic, Numerology, ACG)...")
        from services.astrocartography_engine import AstrocartographyEngine
        
        vedic_task = AstrologyAggregator.get_vedic_full_report(
            name, year, month, day, hour, minute, lat, lng, lang=lang, timezone=timezone, context=context
        )
        numerology_task = asyncio.to_thread(
            get_numerology_data,
            name, year, month, day, context=context, lang=lang, gender=gender
        )
        acg_task = asyncio.to_thread(
            AstrocartographyEngine.calculate_power_zones,
            name, year, month, day, hour, minute
        )

        print(f"DEBUG: vedic_task type: {type(vedic_task)}")
        print(f"DEBUG: numerology_task type: {type(numerology_task)}")
        print(f"DEBUG: acg_task type: {type(acg_task)}")

        # Wait for all base data
        vedic_full, numerology, acg_locations_raw = await asyncio.gather(
            vedic_task, numerology_task, acg_task, return_exceptions=True
        )

        # Exception handling for gathered tasks
        if isinstance(vedic_full, Exception):
            print(f"Vedic Error: {vedic_full}")
            vedic_full = {"planets": [], "panchang": {}, "dasha": [], "divisional_charts": {}, "ayanamsa": "", "remedies": []} # Min fallback
        
        if isinstance(numerology, Exception):
            print(f"Numerology Error: {numerology}")
            numerology = {"life_path": 0, "source": "error"}
            
        if isinstance(acg_locations_raw, Exception):
            print(f"Warning: Astrocartography failed: {acg_locations_raw}")
            acg_locations = []
        else:
            acg_locations = acg_locations_raw

        # 2. Detailed AI Analyses (Parallelizing the dependent AI calls)
        print("- Starting AI Synthesis Layer (Parallel)...")
        from services.ai_service import generate_vedic_chart_analysis, generate_relationship_analysis, generate_vedic_ai_summary
        from services.kp_prediction_service import KPPredictionService
        
        # Define tasks
        personality_task = generate_vedic_chart_analysis(
            name, vedic_full['planets'], vedic_full['panchang'], 
            doshas=vedic_full.get('doshas', {}), lang=lang,
            dob=f"{day}-{month}-{year}", place=city, age=age
        )

        relationship_task = generate_relationship_analysis(
            name, vedic_full['planets'], vedic_full['panchang'], lang=lang, age=age
        )

        prediction_task = AstrologyAggregator.get_aggregated_best_prediction(
            name, year, month, day, hour, minute, city, lat, lng, timezone,
            vedic_data=vedic_full, numerology_data=numerology,
            western_data=western_chart, context=context, lang=lang
        )
        
        vedic_summary_task = generate_vedic_ai_summary(
            name, vedic_full['planets'], vedic_full.get('panchang', {}), 
            vedic_full.get('dasha', {}), lang=lang, context=context, 
            doshas=vedic_full.get('doshas', {}), transits=vedic_full.get('current_transits', [])
        )

        # Non-AI parallel tasks (Use to_thread if they are sync)
        svg_task = asyncio.to_thread(
            AstrologyAggregator.get_kundali_svg,
            name, year, month, day, hour, minute, lat, lng, lang=lang, timezone=timezone
        )
        navamsa_svg_task = asyncio.to_thread(
            AstrologyAggregator.get_navamsa_svg,
            name, year, month, day, hour, minute, lat, lng, lang=lang, timezone=timezone
        )

        # Run all together
        personality_res, relation_res, predictions_res, vedic_summary_res, kungali_svg_res, navamsa_svg_res = await asyncio.gather(
            personality_task, relationship_task, prediction_task, vedic_summary_task, svg_task, navamsa_svg_task,
            return_exceptions=True
        )

        print(f"DEBUG: personality_res type: {type(personality_res)}")
        print(f"DEBUG: relation_res type: {type(relation_res)}")
        print(f"DEBUG: predictions_res type: {type(predictions_res)}")
        print(f"DEBUG: vedic_summary_res type: {type(vedic_summary_res)}")
        print(f"DEBUG: kungali_svg_res type: {type(kungali_svg_res)}")
        print(f"DEBUG: navamsa_svg_res type: {type(navamsa_svg_res)}")

        # Helper to safety check results
        def safe_res(val, log_name):
            if isinstance(val, Exception):
                print(f"{log_name} Error: {val}")
                return None
            return val

        vedic_personality_analysis = safe_res(personality_res, "Personality AI")
        relationship_analysis = safe_res(relation_res, "Relationship AI")
        predictions = safe_res(predictions_res, "Predictions AI")
        ai_summary = safe_res(vedic_summary_res, "Vedic Summary AI")
        kundali_svg = safe_res(kungali_svg_res, "SVG")
        navamsa_svg = safe_res(navamsa_svg_res, "Navamsa SVG")

        # Extract Loshu Grid to move it to Vedic Astrology
        loshu_data = numerology.pop('loshu_grid', None) if isinstance(numerology, dict) else None
        transits = vedic_full.get('transits', []) # Already calculated in get_vedic_full_report

        # Generate KP Event Predictions (Age-aware)
        print(f"- Generating KP Event Predictions (Age: {age} years)...")
        try:
            # KP Service is likely sync
            kp_predictions = KPPredictionService.generate_event_predictions(
                kp_cusps=vedic_full.get('kp_cusps'),
                kp_system_data=vedic_full.get('kp_system'),
                dasha_data=vedic_full.get('dasha'),
                lang=lang,
                age=age
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
                "kundali_analysis": vedic_full.get('kundali_analysis'), 
                "planets": vedic_full.get('planets', []),
                "panchang": vedic_full.get('panchang', {}),
                "dasha": vedic_full.get('dasha', []),
                "divisional_charts": vedic_full.get('divisional_charts', {}),
                "ayanamsa": vedic_full.get('ayanamsa', ""),
                "remedies": vedic_full.get('remedies', []),
                "doshas": vedic_full.get('doshas', {}),
                "kp_system": vedic_full.get('kp_system'), 
                "kp_analysis": vedic_full.get('kp_analysis'),
                "kp_cusps": vedic_full.get('kp_cusps'),
                "transits": transits,
                "graha_effects": vedic_full.get('graha_effects'),
                "ai_summary": ai_summary,
                "chart_svg": kundali_svg,
                "navamsa_svg": navamsa_svg,
                "vedic_personality_analysis": vedic_personality_analysis,
                "career_analysis": None,
                "relationship_analysis": relationship_analysis,
                "avakhada": vedic_full.get('avakhada')
            },
            "astrocartography": acg_locations,
            "predictions_summary": predictions,
            "kp_analysis": kp_predictions
        }
        
        return report

if __name__ == "__main__":
    print("ReportGenerator service loaded.")
