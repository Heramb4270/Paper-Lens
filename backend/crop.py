import os
from pdf2image import convert_from_path
from PIL import Image

def crop_images(pdf_path):
    
    output_folder = 'output_images'  # Folder to save cropped line images
    dpi = 300  # Resolution for PDF to image conversion

    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Convert PDF pages to images
    pages = convert_from_path(pdf_path, dpi=dpi)

    for page_num, page_image in enumerate(pages, start=1):
        # Save the full-page image (optional)
        page_image.save(f"{output_folder}/page_{page_num}.png", "PNG")
        
        # Convert image to grayscale for better line detection (optional)
        page_image_gray = page_image.convert("L")
        width, height = page_image_gray.size

        # Detect lines (simple equal division)
        num_lines = 40  # Adjust based on your PDF content
        line_height = height // num_lines

        for line_num in range(num_lines):
            # Define cropping box (left, top, right, bottom)
            top = line_num * line_height
            bottom = (line_num + 1) * line_height
            box = (0, top, width, bottom)

            # Crop the line
            line_image = page_image_gray.crop(box)

            # Save the line image with formatted line numbers (e.g., line_01, line_02, ...)
            line_number = f"{line_num + 1:02d}"  # Formats line number as 01, 02, 03, ...
            line_image.save(f"{output_folder}/page_{page_num}_line_{line_number}.png", "PNG")
