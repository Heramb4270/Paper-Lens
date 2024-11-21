import google.generativeai as genai
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from crop import crop_images
from ImageToText import extract_text_from_folder
from extract_text import extract_text

import torch
from dotenv import load_dotenv
import os
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests

# Set up the upload folder
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit file size to 16MB

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/submit-form', methods=['POST'])
def submit_form():
    # Get form fields data
    teacher_name = request.form.get('teacher')
    student_name = request.form.get('student')
    prn = request.form.get('prn')
    subject_code = request.form.get('subject')

    # Debugging form data
    print("Form Data:")
    print(f"Teacher: {teacher_name}")
    print(f"Student: {student_name}")
    print(f"PRN: {prn}")
    print(f"Subject Code: {subject_code}")

    # Get uploaded files
    answer_key = request.files.get('answer_key')
    answer_sheet = request.files.get('answer_sheet')

    answer_key_path = None
    answer_sheet_path = None

    if answer_key:
        # Save answer key file
        answer_key_path = os.path.join(app.config['UPLOAD_FOLDER'], answer_key.filename)
        answer_key.save(answer_key_path)
        print(f"Answer Key received: {answer_key.filename}")
    else:
        print("No answer key uploaded")

    if answer_sheet:
        # Save answer sheet file
        answer_sheet_path = os.path.join(app.config['UPLOAD_FOLDER'], answer_sheet.filename)
        answer_sheet.save(answer_sheet_path)
        print(f"Answer Sheet received: {answer_sheet.filename}")
    else:
        print("No answer sheet uploaded")
    
    # Response with all received data
    response = {
        'teacher_name': teacher_name,
        'student_name': student_name,
        'prn': prn,
        'subject_code': subject_code,
        'answer_key_path': answer_key_path if answer_key else None,
        'answer_sheet_path': answer_sheet_path if answer_sheet else None
    }

    answer_key_txt = extract_text(answer_key_path)
    print("\nExtracted Answer Key Text:\n")
    print(answer_key_txt)

    student_answer_txt = evaluate_answer_sheet(answer_sheet_path)
    print("\nExtracted Student Answer Text:\n")
    print(student_answer_txt)
    
    return jsonify(response), 200



def evaluate_answer_sheet(answer_sheet_path):
 
    crop_images(answer_sheet_path)
    print("Answer sheet cropped successfully")
    
    output_folder = "./output_images"  # Replace with the path to your folder containing images
    final_text = extract_text_from_folder(output_folder)
    print("Final Extracted Text:\n", final_text)

    return final_text


load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')

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
    app.run(debug=True)
