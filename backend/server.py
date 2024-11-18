from flask import Flask, request, jsonify
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Initialize Flask app
app = Flask(__name__)

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

# # Example usage
# image_path = "./00929.png"  # Replace with your image path
# extracted_text = ocr_image(image_path)
# print("Extracted Text:", extracted_text)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

