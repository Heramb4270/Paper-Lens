import cv2
import numpy as np
import fitz  # PyMuPDF
import os

def crop_images(pdf_path, dpi=400):
    # make output directory empty before processing
    for file in os.listdir('./output/pages'):
        os.remove(f'./output/pages/{file}')
    for file in os.listdir('./output/lines'):
        os.remove(f'./output/lines/{file}')
        
    # Ensure output directories exist
    os.makedirs("./output/pages", exist_ok=True)
    os.makedirs("./output/lines", exist_ok=True)

    # Open the PDF using PyMuPDF
    pdf_document = fitz.open(pdf_path)
    
    for page_num in range(len(pdf_document)):
        # Render the page as a Pixmap with specified DPI
        page = pdf_document.load_page(page_num)
        zoom = dpi / 72  # Default DPI for PDF is 72, so scale accordingly
        mat = fitz.Matrix(zoom, zoom)  # Scaling matrix for higher DPI
        pix = page.get_pixmap(matrix=mat)
        
        image_path = f"./output/pages/page_{page_num + 1}.png"
        
        # Save the image in lossless format (PNG)
        pix.save(image_path)
        
        # Call get_lines_from_image for each saved page
        get_lines_from_image(image_path, page_num + 1)
    
    print("PDF pages processed and segmented into lines successfully.")

def get_lines_from_image(image_path, page_num):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Thresholding function
    def thresholding(image):
        img_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        ret, thresh = cv2.threshold(img_gray, 82, 255, cv2.THRESH_BINARY_INV)
        return thresh

    thresh_img = thresholding(img)
    
    # Dilation to connect components within lines
    kernel = np.ones((2, 85), np.uint8)
    dilated = cv2.dilate(thresh_img, kernel, iterations=1)
    
    # Find contours of the lines
    contours, hierarchy = cv2.findContours(dilated.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    
    # Sort contours by Y (top to bottom), then by X (left to right)
    contours = sorted(contours, key=lambda ctr: (cv2.boundingRect(ctr)[1], cv2.boundingRect(ctr)[0]))

    # Copy original image to draw rectangles
    img2 = img.copy()

    # List to hold lines and their bounding boxes
    lines = []

    # Iterate through contours and extract lines
    for idx, ctr in enumerate(contours):
        x, y, w, h = cv2.boundingRect(ctr)
        
        # Ignore very small lines (noise)
        if h < 18:
            continue
        
        lines.append((x, y, w, h, idx))  # Store bounding box and index for sorting

    # Sort all lines by Y-position and X-position for top-to-bottom, left-to-right order
    lines = sorted(lines, key=lambda line: (line[1], line[0]))  # Sort by Y, then by X
    
    # Process the sorted lines and save them
    img2 = img.copy()
    line_counter = 1
    for (x, y, w, h, idx) in lines:
        # Draw bounding boxes on the lines
        cv2.rectangle(img2, (x, y), (x + w, y + h), (40, 100, 250), 2)
        
        # Save each line as a separate image with page number and line number in the filename
        line_image_path = f'./output/lines/page_{page_num}_line_{str(line_counter).zfill(3)}.png'
        cv2.imwrite(line_image_path, cv2.cvtColor(img[y:y + h, x:x + w], cv2.COLOR_RGB2BGR))
        line_counter += 1
    
    # Save the image with bounding boxes
    cv2.imwrite(f'./output/lines/lines_{os.path.basename(image_path)}', cv2.cvtColor(img2, cv2.COLOR_RGB2BGR))
    
    print(f"Processed lines from {image_path}")