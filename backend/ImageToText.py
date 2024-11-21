import os
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Set up device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the fine-tuned model
checkpoint_path = './checkpoint-2070'  # Path to your fine-tuned model checkpoint
model = VisionEncoderDecoderModel.from_pretrained(checkpoint_path).to(device)

# Use the original model's processor (tokenizer and feature extractor)
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-large-handwritten")

def read_image(image_path):
    """
    Reads and converts an image to RGB format.
    :param image_path: Path to the input image.
    :return: PIL Image object.
    """
    return Image.open(image_path).convert('RGB')

def ocr_image(image_path):
    """
    Perform OCR on a single image.
    :param image_path: Path to the input image.
    :return: Extracted text from the image.
    """
    image = read_image(image_path)
    pixel_values = processor(image, return_tensors='pt').pixel_values.to(device)
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return generated_text

import re
import shutil

def extract_text_from_folder(folder_path):
    """
    Extract text from images in a folder with specific naming patterns and concatenate the results.
    Only processes images named in the format 'page_X_line_Y.ext'.
    Deletes the folder containing the images after processing.
    
    :param folder_path: Path to the folder containing images.
    :return: Concatenated text from all valid images.
    """
    all_text = ""
    # List all image files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('png', 'jpg', 'jpeg'))]
    
    # Sort files to maintain order if required
    image_files.sort()

    # Filter to include only filenames with "page_X_line_Y" pattern
    line_pattern = re.compile(r'page_\d+_line_\d+')

    for image_file in image_files:
        # Check if the filename matches the required pattern
        if line_pattern.search(image_file):
            image_path = os.path.join(folder_path, image_file)
            print(f"Processing {image_path}...")
            extracted_text = ocr_image(image_path)
            all_text += extracted_text + " "
        else:
            print(f"Skipping {image_file} (does not match line pattern).")

    # Delete the folder containing the images
    print(f"Deleting folder: {folder_path}")
    shutil.rmtree(folder_path)

    return all_text
