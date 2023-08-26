from flask import Flask, render_template, request, send_file
from PIL import Image
from flask import send_file
Image.MAX_IMAGE_PIXELS = None
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/convert', methods=['POST'])
def convert_image():
    file = request.files['file']
    img_format = request.form['format']
    
    if file:
        img = Image.open(file)
        img = img.convert('RGB')  # Convertir a RGB
        filename = 'converted_image.' + img_format.lower()
        img.save(filename, format=img_format)
        
        # Enviar archivo y luego eliminarlo
        try:
            return send_file(filename, as_attachment=True)
        finally:
            os.remove(filename)
    else:
        return 'Error: Todos los campos son requeridos.'

@app.route('/resize', methods=['POST'])
def resize_image():
    file = request.files['file']
    width = request.form['width']
    height = request.form['height']
    img_format = request.form['format']
    
    if file and width and height:
        img = Image.open(file)
        img = img.convert('RGB')  # Convertir a RGB
        img_resized = img.resize((int(width), int(height)))
        filename = 'resized_image.' + img_format.lower()
        img_resized.save(filename, format=img_format)
        
        # Enviar archivo y luego eliminarlo
        try:
            return send_file(filename, as_attachment=True)
        finally:
            os.remove(filename)
    else:
        return 'Error: Todos los campos son requeridos.'


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

