import pdfplumber
import re

def extract_grades_from_pdf(pdf_file):
    """Extract grades from Parul University grade sheet PDF"""
    extracted = []
    
    with pdfplumber.open(pdf_file) as pdf:
        print(f"[DEBUG] Total pages in PDF: {len(pdf.pages)}")
        
        for page_num, page in enumerate(pdf.pages, 1):
            print(f"\n[DEBUG] === PAGE {page_num} ===")
            
            # Extract tables from the page
            tables = page.extract_tables()
            print(f"[DEBUG] Number of tables found: {len(tables) if tables else 0}")
            
            if not tables:
                print("[DEBUG] No tables found on this page")
                continue
            
            for table_num, table in enumerate(tables, 1):
                print(f"\n[DEBUG] Processing table {table_num} with {len(table)} rows")
                
                for row_num, row in enumerate(table):
                    if not row or len(row) < 4:
                        continue
                    
                    # Clean all cells
                    cleaned_row = [safe_strip(cell) for cell in row]
                    
                    # Skip if row is empty
                    if not any(cleaned_row):
                        continue
                    
                    # Get the cells
                    subject_code_cell = cleaned_row[0] if len(cleaned_row) > 0 else ""
                    subject_name_cell = cleaned_row[1] if len(cleaned_row) > 1 else ""
                    grade_cell = cleaned_row[3] if len(cleaned_row) > 3 else ""
                    
                    # Skip header rows
                    if 'subject code' in subject_code_cell.lower() or 'subject name' in subject_name_cell.lower():
                        print(f"[DEBUG] Row {row_num}: Skipped - header row")
                        continue
                    
                    # Check if this cell contains multiple entries (separated by newlines)
                    if '\n' in subject_code_cell or '\n' in subject_name_cell or '\n' in grade_cell:
                        print(f"[DEBUG] Row {row_num}: Found merged row - splitting by newlines")
                        
                        # Split by newlines
                        codes = [c.strip() for c in subject_code_cell.split('\n') if c.strip()]
                        name_lines = [n.strip() for n in subject_name_cell.split('\n') if n.strip()]
                        grades = [g.strip() for g in grade_cell.split('\n') if g.strip()]
                        
                        print(f"[DEBUG] Raw split: {len(codes)} codes, {len(name_lines)} name lines, {len(grades)} grades")
                        
                        # Reconstruct subject names (merge lines that don't have corresponding codes)
                        names = []
                        current_name = ""
                        name_idx = 0
                        
                        for line in name_lines:
                            if line.lower() == 'total':
                                continue
                                
                            # If we have accumulated a name and this line starts a new subject
                            # (we have more codes to process), save the current name
                            if current_name and name_idx < len(codes) - 1:
                                # Check if next line looks like a continuation (doesn't start with capital)
                                # or if we've collected enough for this code
                                if len(names) < len(codes):
                                    # Only add if not already added for this code
                                    if len(names) == name_idx:
                                        names.append(current_name)
                                        name_idx += 1
                                        current_name = line
                                    else:
                                        current_name += " " + line
                                else:
                                    current_name += " " + line
                            else:
                                if current_name:
                                    current_name += " " + line
                                else:
                                    current_name = line
                        
                        # Add the last accumulated name
                        if current_name and current_name.lower() != 'total':
                            names.append(current_name)
                        
                        # If reconstruction didn't work well, fall back to matching by count
                        if len(names) != len(codes):
                            print(f"[DEBUG] Name reconstruction mismatch. Using simpler approach...")
                            # Simple approach: pair codes with grades, use best-effort names
                            names = []
                            for i, code in enumerate(codes):
                                if i < len(name_lines):
                                    # Collect name lines until we hit the next code or run out
                                    name = name_lines[i]
                                    # Check if next line is a continuation (no matching code at this position)
                                    if i + 1 < len(name_lines) and i + 1 < len(codes):
                                        # If there are more name lines than codes, it's a multi-line name
                                        if len(name_lines) > len(codes):
                                            extra_idx = i + len(codes) - len(grades)
                                            if extra_idx < len(name_lines):
                                                name += " " + name_lines[extra_idx]
                                    names.append(name)
                        
                        print(f"[DEBUG] Final: {len(codes)} codes, {len(names)} names, {len(grades)} grades")
                        
                        # Match them up
                        min_len = min(len(codes), len(names), len(grades))
                        print(f"[DEBUG] Processing {min_len} subjects from this row")
                        
                        for i in range(min_len):
                            code = codes[i]
                            name = names[i].strip()
                            grade = grades[i]
                            
                            print(f"[DEBUG]   Subject {i+1}: '{code}' | '{name}' | '{grade}'")
                            
                            # Skip if name is "Total"
                            if name.lower() == 'total':
                                print(f"[DEBUG]   Skipped - is Total row")
                                continue
                            
                            # Validate subject code (8 digits)
                            if not re.match(r'^\d{8}$', code):
                                print(f"[DEBUG]   Skipped - code doesn't match 8 digits: '{code}'")
                                continue
                            
                            # Validate grade
                            valid_grades = ['O', 'A+', 'A', 'B+', 'B', 'P', 'F', 'F1', 'F2', 'F3']
                            if grade.upper() not in valid_grades:
                                print(f"[DEBUG]   Skipped - invalid grade: '{grade}'")
                                continue
                            
                            # Add to extracted data
                            extracted.append({
                                "subject": name,
                                "grade": grade.upper()
                            })
                            
                            print(f"[SUCCESS]   ✓ Added: {code} | {name} | {grade}")
    
    if not extracted:
        print("\n[ERROR] No grade data extracted from PDF")
        raise ValueError("No grade data extracted from PDF")
    
    print(f"\n[SUCCESS] ========================================")
    print(f"[SUCCESS] Total subjects extracted: {len(extracted)}")
    print(f"[SUCCESS] ========================================")
    for item in extracted:
        print(f"[SUCCESS]   - {item['subject']}: {item['grade']}")
    
    return extracted


def safe_strip(val):
    """Safely strip whitespace from value"""
    if val is None:
        return ""
    return str(val).strip()