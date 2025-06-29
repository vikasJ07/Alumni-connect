# venv\Scripts\activate
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

UPLOAD_FOLDER = "static/uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_and_extract_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    image_file.save(image_path)

    try:
        image = Image.open(image_path)
        print(image)
        extracted_text = pytesseract.image_to_string(image, lang='eng')
        print("Hey")
        image.close()

        os.remove(image_path)

        return jsonify({'extracted_text': extracted_text})
    except Exception as e:
        if os.path.exists(image_path):
            os.remove(image_path)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
