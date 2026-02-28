import json
import asyncio
from datetime import datetime
from services.kerykeion_engine import KerykeionService
from services.numerology_service import get_numerology_data
from services.astrology_aggregator import AstrologyAggregator

# ─── AI call timeout (seconds) ──────────────────────────────────────────────
AI_TIMEOUT = 25  # Each AI call gets max 25s before it falls back to None


class ReportGenerator:
    @staticmethod
    async def generate_consolidated_report(
        name, year, month, day, hour, minute, city, lat, lng,
        timezone=None, context=None, lang="en", gender="male"
    ):
        t_start = datetime.now()
        print(f"[Report] Starting for {name} ({lang})...")

        # ── Age ──────────────────────────────────────────────────────────────
        birth_date = datetime(year, month, day)
        today = datetime.now()
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )
        if context is None:
            context = {}
        context['age'] = age

        # ── WAVE 1: Core data — all computed in parallel ──────────────────────
        print("[Report] Wave 1: Vedic + Numerology + ACG...")
        from services.astrocartography_engine import AstrocartographyEngine

        vedic_full, numerology, acg_locations_raw = await asyncio.gather(
            AstrologyAggregator.get_vedic_full_report(
                name, year, month, day, hour, minute, lat, lng,
                lang=lang, timezone=timezone, context=context
            ),
            asyncio.to_thread(
                get_numerology_data,
                name, year, month, day, context=context, lang=lang, gender=gender
            ),
            asyncio.to_thread(
                AstrocartographyEngine.calculate_power_zones,
                name, year, month, day, hour, minute
            ),
            return_exceptions=True
        )

        if isinstance(vedic_full, Exception):
            print(f"[Report] Vedic Error: {vedic_full}")
            vedic_full = {
                "planets": [], "panchang": {}, "dasha": [],
                "divisional_charts": {}, "ayanamsa": "", "remedies": []
            }
        if isinstance(numerology, Exception):
            print(f"[Report] Numerology Error: {numerology}")
            numerology = {"life_path": 0, "source": "error"}
        acg_locations = [] if isinstance(acg_locations_raw, Exception) else acg_locations_raw

        t_wave1 = (datetime.now() - t_start).total_seconds()
        print(f"[Report] Wave 1 done in {t_wave1:.1f}s")

        # ── Prepare pre-computed sidereal data for reuse ─────────────────────
        # get_vedic_full_report already computed sidereal internally.
        # We store the planets/panchang so SVG builders can reuse them
        # without re-running calculate_sidereal_planets.
        planets = vedic_full.get('planets', [])
        panchang = vedic_full.get('panchang', {})
        dasha = vedic_full.get('dasha', {})
        doshas = vedic_full.get('doshas', {})

        # ── WAVE 2: All AI + SVG tasks fully parallel ─────────────────────────
        print("[Report] Wave 2: AI synthesis + SVGs + KP predictions (parallel)...")

        from services.ai_service import (
            generate_vedic_chart_analysis,
            generate_relationship_analysis,
            generate_vedic_ai_summary,
        )
        from services.kp_prediction_service import KPPredictionService

        async def with_timeout(coro, label):
            """Wrap a coroutine with a timeout; returns None on timeout/error."""
            try:
                return await asyncio.wait_for(coro, timeout=AI_TIMEOUT)
            except asyncio.TimeoutError:
                print(f"[Report] TIMEOUT ({AI_TIMEOUT}s): {label}")
                return None
            except Exception as e:
                print(f"[Report] Error in {label}: {e}")
                return None

        # SVG builders reuse planets already fetched (no extra sidereal call)
        async def build_kundali_svg():
            from services.kundali_painter import KundaliPainter
            try:
                asc_sign = vedic_full.get("ascendant", {}).get("sign_id", 1)
                return KundaliPainter.draw_north_indian_chart(
                    planets, "Lagna Chart (D1)", lang=lang, ascendant_sign=asc_sign
                )
            except Exception as e:
                print(f"[Report] Kundali SVG error: {e}")
                return None

        async def build_navamsa_svg():
            from services.vedic_astro_engine import VedicAstroEngine
            from services.kundali_painter import KundaliPainter
            try:
                # divisional_charts already computed in wave 1
                d_charts = vedic_full.get('charts') or vedic_full.get('divisional_charts', {})
                navamsa_planets = d_charts.get("D9", [])
                asc_lon = vedic_full.get("ascendant", {}).get("longitude", 0)
                asc_sign_idx = int(asc_lon // 30) % 12
                pos_in_sign = asc_lon % 30
                pada = int(pos_in_sign / (30 / 9)) + 1
                element_group = asc_sign_idx % 4
                start_offsets = [0, 9, 6, 3]
                nav_asc_sign = (start_offsets[element_group] + (pada - 1)) % 12 + 1
                return KundaliPainter.draw_north_indian_chart(
                    navamsa_planets, "Navamsa Chart (D9)", lang=lang, ascendant_sign=nav_asc_sign
                )
            except Exception as e:
                print(f"[Report] Navamsa SVG error: {e}")
                return None

        async def run_kp_predictions():
            try:
                return await asyncio.to_thread(
                    KPPredictionService.generate_event_predictions,
                    kp_cusps=vedic_full.get('kp_cusps'),
                    kp_system_data=vedic_full.get('kp_system'),
                    dasha_data=dasha,
                    lang=lang,
                    age=age
                )
            except Exception as e:
                print(f"[Report] KP Predictions error: {e}")
                return {"predictions": []}

        # Build aggregated prediction WITHOUT the inner generate_executive_summary call
        # (that was a redundant 4th AI call — we already have vedic_summary doing AI synthesis)
        async def build_predictions():
            try:
                return await AstrologyAggregator.get_aggregated_best_prediction(
                    name, year, month, day, hour, minute, city, lat, lng, timezone,
                    vedic_data=vedic_full, numerology_data=numerology,
                    western_data=None, context=context, lang=lang
                )
            except Exception as e:
                print(f"[Report] Predictions error: {e}")
                return None

        (
            personality_res,
            relation_res,
            vedic_summary_res,
            predictions_res,
            kundali_svg,
            navamsa_svg,
            kp_predictions,
        ) = await asyncio.gather(
            with_timeout(
                generate_vedic_chart_analysis(
                    name, planets, panchang,
                    doshas=doshas, lang=lang,
                    dob=f"{day}-{month}-{year}", place=city, age=age
                ),
                "Personality AI"
            ),
            with_timeout(
                generate_relationship_analysis(name, planets, panchang, lang=lang, age=age),
                "Relationship AI"
            ),
            with_timeout(
                generate_vedic_ai_summary(
                    name, planets, panchang, dasha, lang=lang, context=context,
                    doshas=doshas, transits=vedic_full.get('current_transits', [])
                ),
                "Vedic Summary AI"
            ),
            with_timeout(build_predictions(), "Predictions"),
            build_kundali_svg(),
            build_navamsa_svg(),
            run_kp_predictions(),
            return_exceptions=False
        )

        t_wave2 = (datetime.now() - t_start).total_seconds()
        print(f"[Report] Wave 2 done in {t_wave2:.1f}s (total so far)")

        # ── Consolidate ───────────────────────────────────────────────────────
        loshu_data = numerology.pop('loshu_grid', None) if isinstance(numerology, dict) else None
        transits = vedic_full.get('transits', [])

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
            "western_astrology": None,
            "vedic_astrology": {
                "kundali_analysis": vedic_full.get('kundali_analysis'),
                "planets": planets,
                "panchang": panchang,
                "dasha": dasha,
                "divisional_charts": vedic_full.get('charts') or vedic_full.get('divisional_charts', {}),
                "ayanamsa": vedic_full.get('ayanamsa', ""),
                "remedies": vedic_full.get('remedies', []),
                "doshas": doshas,
                "kp_system": vedic_full.get('kp_system'),
                "kp_analysis": vedic_full.get('kp_analysis'),
                "kp_cusps": vedic_full.get('kp_cusps'),
                "transits": transits,
                "graha_effects": vedic_full.get('graha_effects'),
                "ai_summary": vedic_summary_res,
                "chart_svg": kundali_svg,
                "navamsa_svg": navamsa_svg,
                "vedic_personality_analysis": personality_res,
                "career_analysis": None,
                "relationship_analysis": relation_res,
                "avakhada": vedic_full.get('avakhada')
            },
            "astrocartography": acg_locations,
            "predictions_summary": predictions_res,
            "kp_analysis": kp_predictions
        }

        t_total = (datetime.now() - t_start).total_seconds()
        print(f"[Report] Completed in {t_total:.1f}s total")
        return report


if __name__ == "__main__":
    print("ReportGenerator service loaded.")
