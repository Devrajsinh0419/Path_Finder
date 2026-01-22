import pdfplumber
import re

SUBJECT_CODE_REGEX = re.compile(r"^\d{8}$")

GRADE_TO_MARKS = {
    "O": 95,
    "A+": 85,
    "A": 75,
    "B+": 65,
    "B": 55,
    "C": 45,
    "P": 40,
    "F": 0,
}

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
                    grade = safe_strip(row[3])

                    if not SUBJECT_CODE_REGEX.match(code):
                        continue

                    marks = GRADE_TO_MARKS.get(grade.upper())
                    if marks is None:
                        continue

                    extracted.append({
                        "subject": name,
                        "marks": marks,
                    })

    if not extracted:
        raise ValueError("No grade data extracted from PDF")

    return {item["subject"]: item["marks"] for item in extracted}


def safe_strip(val):
    return val.strip() if val else ""
