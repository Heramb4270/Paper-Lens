from flask import Flask, request, jsonify
from PIL import Image
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Initialize Flask app
app = Flask(__name__)

# Define device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load processor and custom-trained model checkpoint
checkpoint_dir = 'D:/BTech/Third_Year/Module 5/EDI/Paper-Lens/backend/checkpoint-2070'
processor = TrOCRProcessor.from_pretrained(checkpoint_dir)
model = VisionEncoderDecoderModel.from_pretrained(checkpoint_dir).to(device)

# OCR function using custom-trained model
def ocr(image, processor, model):
    """
    :param image: PIL Image.
    :param processor: Huggingface OCR processor.
    :param model: Huggingface OCR model.

    Returns:
        generated_text: the OCR'd text string.
    """
    pixel_values = processor(image, return_tensors='pt').pixel_values.to(device)
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return generated_text

# Flask route for OCR
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found in the request.'}), 400
    
    # Get the image from the request
    file = request.files['image']
    try:
        image = Image.open(file).convert("RGB")  # Open image and convert to RGB
    except Exception as e:
        return jsonify({'error': f'Failed to process the image: {str(e)}'}), 400
    
    # Perform OCR
    try:
        text = ocr(image, processor, model)
        return jsonify({'text': text}), 200
    except Exception as e:
        return jsonify({'error': f'OCR failed: {str(e)}'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
