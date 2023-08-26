from flask import Flask, render_template, request, send_file
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
from rembg import remove
import os
import io
from discord_webhook import DiscordWebhook

app = Flask(__name__)

webhook_url = ""

@app.route('/')
def index():
    client_ip = request.remote_addr
    webhook = DiscordWebhook(url=webhook_url, content=f'Un usuario ha abierto la página. IP: {client_ip}')
    webhook.execute()
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
            webhook = DiscordWebhook(url=webhook_url, content='Un usuario ha convertido una imagen')
            webhook.execute()
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
            webhook = DiscordWebhook(url=webhook_url, content='Un usuario ha redimensionado una imagen')
            webhook.execute()
            return send_file(filename, as_attachment=True)
        finally:
            os.remove(filename)
    else:
        return 'Error: Todos los campos son requeridos.'
    
@app.route('/remove_background', methods=['POST'])
def remove_background():
    file = request.files['file']
    
    if file:
        print("Recibido archivo")
        img_bytes = file.read()
        print("Leídos bytes del archivo")
        output_bytes = remove(img_bytes)
        print("Fondo removido")
        output_img = Image.open(io.BytesIO(output_bytes))
        filename = 'background_removed.png'
        output_img.save(filename)
        print("Imagen guardada")
        
        # Enviar archivo y luego eliminarlo
        try:
            print("Enviando archivo")
            webhook = DiscordWebhook(url=webhook_url, content='Un usuario ha removido el fondo de una imagen')
            webhook.execute()
            return send_file(filename, as_attachment=True)
        finally:
            print("Eliminando archivo")
            os.remove(filename)
    else:
        print("Error: Todos los campos son requeridos.")
        return 'Error: Todos los campos son requeridos.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
