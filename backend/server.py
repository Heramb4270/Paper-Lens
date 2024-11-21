# import google.generativeai as genai
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

load_dotenv()
API_KEY = os.getenv('GEMINI_API_KEY')

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
    # answer_key_txt= 'Q.1 a) Define the term "Operating System". (2 Marks) An Operating System (OS) is a software that acts as an interface between the computer hardware and the computer user. It manages hardware resources and provides essential services for computer programs. Q.1 b) Explain the difference between a process and a thread. (2 Marks) A process is an instance of a program in execution, while a thread is a smaller unit of a process that can be scheduled and executed independently.Q.1 c) Describe the functions of an operating system in a computer system. (4 Marks) The functions of an operating system include: Process management: Ensures that processes are scheduled and executed correctly. Memory management: Allocates and deallocates memory space to processes. File system management: Manages files, directories, and access permissions. Device management: Controls input/output devices like printers, displays, etc. Security and access control: Protects system resources from unauthorized access. Q.1 d) What is the role of a kernel in an operating system? (2 Marks) The kernel is the core part of the operating system that manages the system resources, such as the CPU, memory, and devices. It acts as a bridge between applications and hardware.'

    # student_answer_txt = "Q.1 a) An operating system is a software system that manages hardware and provides an interface for users to interact with the computer.b) Process and Thread:A process is a program currently being run by the computer. A thread is a lightweight version of a process that executes a portion of the process's code.c) Functions of Operating System:Processes: Manages the activities of multiple processes.Memory: Ensures all programs and processes have enough memory.Devices: Controls input devices like printers.Security: Protects data and programs from hackers.d) Kernel:The kernel is an essential part of the OS.It manages memory, the CPU, and other resources, acting as an intermediary between software and hardware."

    grading = compare_student_and_model_ans(answer_key_txt,student_answer_txt)
    
    return jsonify(response), 200

def evaluate_answer_sheet(answer_sheet_path):
 
    crop_images(answer_sheet_path)
    print("Answer sheet cropped successfully")
    
    output_folder = "./output_images"  # Replace with the path to your folder containing images
    final_text = extract_text_from_folder(output_folder)

    return final_text

def compare_student_and_model_ans(answer_key_txt, student_answer_txt):
    # Ensure Google Generative AI is configured
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    try:
        model_answer = answer_key_txt
        student_answer = student_answer_txt

        # Check for missing data
        if not model_answer or not student_answer:
            return jsonify({'error': 'Both model_answer and student_answer are required.'}), 400

        # Prompt for the AI evaluation
        prompt = f"""
        Evaluate the following student's answer against the provided model answer. 

        Model Answer:
        {model_answer}

        Student Answer:
        {student_answer}

        Each question has a specific maximum mark, indicated alongside the question. The student's answer is extracted from handwritten text, so it may contain various errors such as grammatical, spelling, or continuity issues. Please ignore these errors and focus on the content to evaluate the answers fairly. 

        For each question:
        1. Assign marks out of the maximum marks for the question based on accuracy, completeness, and relevance to the model answer.

        For the overall paper:
        1. Provide total marks based on the cumulative score of all questions.
        2. Include a brief analysis of the overall performance.

        Return the following:
        1. Marks for each question.
        2. Total marks for the entire paper.

        Note : check it moderately and give marks accordingly becuase this marks will be reflected in answer sheet of student.
        """

        # Generate content using the model
        response = model.generate_content(prompt)
        
        # Extract and return the evaluation
        #evaluation = response.result  # Adjust based on actual response structure
        print("Generated Evaluation:\n", response)

        return response

    except Exception as e:
        print(f"An error occurred while generating the evaluation: {e}")
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
