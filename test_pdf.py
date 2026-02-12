
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.pdf_service import PDFReportService
import json

mock_report = {
    "profile": {
        "name": "Test User",
        "dob": "1990-01-01",
        "tob": "12:00",
        "place": "Delhi",
        "coordinates": {"lat": 28.6139, "lng": 77.2090}
    },
    "numerology": {
        "loshu_grid": {
            "mulank": 1, 
            "bhagyank": 2,
            "grid": {1: 2, 2: 1},
            "completed_planes": ["Mental Plane"],
            "remedies": {3: "Wear Rudraksha"}
        },
        "science_of_success": {
            "fadic_number": 5,
            "fadic_type": "Versatile",
            "symbol": "Mercury",
            "description": "Test description",
            "qualities": {"positive": "Agile, Talkative", "negative": "Restless"},
            "guidance": {
                "lucky_days": ["Wednesday"],
                "lucky_colors": ["Green"],
                "lucky_gems": ["Emerald"],
                "occupations": ["Sales"]
            },
            "next_destiny_year": 2025
        }
    },
    "vedic_astrology": {
        "planets": [
            {"name": "Sun", "sign": "Sagittarius", "position": 15, "house": 1, "nakshatra": {"name": "Mula", "pada": 1}}
        ],
        "ascendant": {"sign": "Sagittarius", "longitude": 255},
        "panchang": {
            "tithi": {"name": "Shukla Pratipada"},
            "nakshatra": {"name": "Mula", "lord": "Ketu"},
            "yoga": {"name": "Vishkumbha"},
            "karana": {"name": "Kintughna"},
            "ascendant": {"name": "Sagittarius"}
        },
        "divisional_charts": {
            "D9": [
                {"name": "Sun", "sign": "Aries", "house": 5}
            ]
        },
        "kp_system": [
            {"planet": "Sun", "sign": "Sagittarius", "star_lord": "Ketu", "sub_lord": "Venus"}
        ],
        "kp_analysis": [
            {"meaning": "General success"}
        ],
        "doshas": {
            "manglik": {"present": True, "reason": "Mars in 1st", "remedy": "Pray to Ganesha"}
        },
        "remedies": {
            "gems": [{"name": "Ruby", "reason": "Sun strong"}],
            "mantras": [{"name": "Gayatri", "count": 108}]
        }
    },
    "astrocartography": [
        {"city": "Paris", "description": "Good for career", "line_title": "Sun/MC", "effect_title": "Career"}
    ],
    "kp_analysis": {
        "predictions": [
            {"event": "Job Promotion", "outcome": "Yes", "confidence": "High", "time_window": "2024", "guidance": "Work hard", "kp_logic": {"sublord_judgment": "Strong", "supporting_houses": "2, 6, 10, 11"}}
        ]
    }
}

try:
    print("Starting PDF generation test...")
    buf = PDFReportService.generate_pdf_report(mock_report)
    with open("test.pdf", "wb") as f:
        f.write(buf.getvalue())
    print("PDF generated successfully: test.pdf")
except Exception as e:
    import traceback
    traceback.print_exc()
