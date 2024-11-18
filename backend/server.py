from flask import Flask, request, jsonify
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Initialize Flask app
app = Flask(__name__)

# Set up device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def load_model_and_processor(checkpoint_path):
    # Load the fine-tuned model
    model = VisionEncoderDecoderModel.from_pretrained(checkpoint_path).to(device)
    # Load the original processor from the base model
    processor = TrOCRProcessor.from_pretrained("microsoft/trocr-large-handwritten")
    return model, processor

def extract_text_from_image(image_path, checkpoint_path='./checkpoint-2070'):
    # Load the model and processor
    model, processor = load_model_and_processor(checkpoint_path)
    # Read and process the image
    image = Image.open(image_path).convert('RGB')
    pixel_values = processor(image, return_tensors='pt').pixel_values.to(device)
    # Generate text
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return generated_text

# Flask route for OCR
@app.route('/ocr', methods=['POST'])
def ocr():
    # yet to be implemented
    return jsonify({'message': 'Not implemented yet'})

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

