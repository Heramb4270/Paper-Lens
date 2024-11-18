from pdf2image import convert_from_path

# Path to your PDF file
pdf_path = "test.pdf"
output_folder = "./pdf_images/"

# Convert PDF to images
images = convert_from_path(pdf_path, dpi=300)  # dpi specifies image resolution

# Save images to the output folder
for i, image in enumerate(images):
    image_path = f"{output_folder}page_{i + 1}.jpg"
    image.save(image_path, "JPEG")
    print(f"Saved {image_path}")
