import io

from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import re
import numpy as np
from PIL import Image
import pytesseract

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello this is server for OCR med prediction"

@app.route('/processimage', methods=['POST'])
def processimage():

    file = request.files['k1']
    med_dict = ocrprediction(file)
    print(med_dict)
    return med_dict


def ocrprediction(img_sent):
    file_data = img_sent.read()
    img_stream = io.BytesIO(file_data)
    img = Image.open(img_stream)
    img_np = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    img_ocr_inverted = cv2.bitwise_not(img_np)
    medicine_dict= {}
    img_ocr = pytesseract.image_to_string(img_ocr_inverted)

    pattern = r"(?:1\)|2\)|3\)|4\)|5\)|6\)|7\)|8\)|9\))(.+)"
    matches = re.findall(pattern, img_ocr, flags=re.MULTILINE)

    if matches:
        print("Medicines prescribed by doctor: \n")
        for i,match in enumerate(matches,start=1):
            medicine_dict[f"Medicine{i}"] = match
    else:
        print("No medicines found")

    return medicine_dict

if __name__ == '__main__':
    app.run(debug=True)
