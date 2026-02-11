
from generate_report import ReportGenerator
from services.pdf_service import PDFReportService
import json

def test_pdf_generation():
    name = "Isha Kumari"
    year, month, day = 2001, 8, 31
    hour, minute = 11, 5
    lat, lng = 23.7957, 86.4304 # Dhanbad
    city = "Dhanbad"

    print("Generating report data...")
    report_data = ReportGenerator.generate_consolidated_report(
        name, year, month, day, hour, minute, city, lat, lng
    )
    
    print("Generating PDF...")
    try:
        pdf_buffer = PDFReportService.generate_pdf_report(report_data, lang="en")
        with open("isha_test_report.pdf", "wb") as f:
            f.write(pdf_buffer.getvalue())
        print("PDF generated successfully: isha_test_report.pdf")
    except Exception as e:
        print(f"FAILED TO GENERATE PDF: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pdf_generation()
