import sys
import os
import asyncio
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.astrology_aggregator import AstrologyAggregator

async def main():
    report = await AstrologyAggregator.get_vedic_full_report(
        name="Aksham Jinsi",
        year=1993,
        month=5,
        day=12,
        hour=14,
        minute=40,
        lat=28.6139,
        lng=77.2090,
        timezone="Asia/Kolkata"
    )
    print("Doshas:", report.get('doshas', {}))

if __name__ == "__main__":
    asyncio.run(main())
