import os
from PyPDF2 import PdfReader
from docx import Document

def extract_text(file_path):
    # Check if the file exists
    if not os.path.exists(file_path):
        return "File not found."

    # Determine the file type
    file_extension = os.path.splitext(file_path)[1].lower()

    try:
        if file_extension == ".pdf":
            return extract_text_from_pdf(file_path)
        elif file_extension == ".docx":
            return extract_text_from_docx(file_path)
        else:
            return "Unsupported file format. Please provide a .pdf or .docx file."
    except Exception as e:
        return f"An error occurred: {e}"

def extract_text_from_pdf(pdf_path):
    text = ""
    reader = PdfReader(pdf_path)
    for page in reader.pages:
        text += page.extract_text() + " "  # Add a space between pages
    return clean_text(text)

def extract_text_from_docx(docx_path):
    text = ""
    doc = Document(docx_path)
    for paragraph in doc.paragraphs:
        text += paragraph.text + " "  # Add a space between paragraphs
    return clean_text(text)

def clean_text(text):
    """Remove extra whitespaces and newlines, and return text as a single paragraph."""
    return " ".join(text.split())