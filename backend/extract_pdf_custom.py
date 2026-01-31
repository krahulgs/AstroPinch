import pypdf
import os

pdf_path = r"C:/Users/rahul/Downloads/Hilary Gerard - Numerology_ The Science of Success.pdf"
output_path = "extracted_book.txt"

def extract_text():
    if not os.path.exists(pdf_path):
        print(f"Error: File not found at {pdf_path}")
        return

    try:
        reader = pypdf.PdfReader(pdf_path)
        number_of_pages = len(reader.pages)
        print(f"PDF has {number_of_pages} pages.")
        
        with open(output_path, "w", encoding="utf-8") as f:
            # Extract first 50 pages and then some key chapters if possible
            # We'll just extract all text since it's likely not huge for an old book
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                f.write(f"--- Page {i+1} ---\n")
                f.write(text)
                f.write("\n\n")
        
        print(f"Successfully extracted text to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    extract_text()
