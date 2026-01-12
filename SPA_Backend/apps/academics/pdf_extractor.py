import pdfplumber
import re

SUBJECT_CODE_REGEX = re.compile(r"^\d{8}$")

def extract_grades_from_pdf(pdf_file):
    extracted = []

    with pdfplumber.open(pdf_file) as pdf:
        first_page = pdf.pages[0]
        text = first_page.extract_text() or ""

        if "Semester Grade Report" not in text:
            raise ValueError("Unsupported PDF format")

        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                for row in table:
                    if not row or len(row) < 6:
                        continue

                    code = safe_strip(row[0])
                    name = safe_strip(row[1])
                    credit = safe_float(row[2])
                    grade = safe_strip(row[3])
                    grade_point = safe_float(row[4])

                    if not SUBJECT_CODE_REGEX.match(code):
                        continue

                    if grade_point is None:
                        continue

                    extracted.append({
                        "code": code,
                        "subject": name,
                        "credit": credit,
                        "grade": grade,
                        "grade_point": grade_point
                    })

    if not extracted:
        raise ValueError("No grade data extracted from PDF")

    return extracted


def safe_strip(val):
    return val.strip() if val else ""


def safe_float(val):
    try:
        return float(val)
    except:
        return None
