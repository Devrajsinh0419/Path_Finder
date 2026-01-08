import pdfplumber
import re

def extract_marks_from_pdf(pdf_file):
    extracted = []

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                for row in table:
                    if not row:
                        continue

                    # Example row pattern:
                    # [code, subject, ..., marks]
                    try:
                        code = row[0].strip()
                        subject = row[1].strip()
                        marks = extract_marks(row)

                        if code and marks is not None:
                            extracted.append({
                                "code": code,
                                "subject": subject,
                                "marks": marks
                            })
                    except Exception:
                        continue

    if not extracted:
        raise ValueError("No valid marks found in PDF")

    return extracted


def extract_marks(row):
    # Extract last numeric value as marks
    for cell in reversed(row):
        if cell and re.match(r"^\d+$", cell.strip()):
            return int(cell.strip())
    return None
