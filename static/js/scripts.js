// Función para enviar el formulario
function submitForm(formId) {
    var form = document.getElementById(formId);
    // Verificar la validez del formulario
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);

        // Manejar el progreso de la carga
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                var percentage = (event.loaded / event.total) * 100;
                document.getElementById('progress').innerHTML = '<i class="fas fa-upload"></i> Cargando imagen: ' + percentage.toFixed(2) + '%';
                if (percentage === 100) {
                    document.getElementById('progress').innerHTML = '<i class="fas fa-cog fa-spin"></i> Procesando archivo...';
                }
            }
        };

        // Manejar el cambio de estado de la solicitud
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var blob;
                if (formId === 'removeBackgroundForm') {
                    blob = new Blob([xhr.response], { type: 'image/png' });
                } else {
                    blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                }
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                var fileInput = formId === 'resizeForm' ? document.getElementById('file') : (formId === 'convertForm' ? document.getElementById('convertFile') : document.getElementById('removeBackgroundFile'));
                var fileName = fileInput.files[0].name;
                var fileExtension = fileName.split('.').pop();
                var format = formId === 'resizeForm' ? 'resizeFormat' : (formId === 'convertForm' ? 'convertFormat' : 'png');
                var selectedFormat = document.getElementById(format) ? document.getElementById(format).value.toLowerCase() : 'png';
                link.download = fileName.replace(fileExtension, selectedFormat);
                link.click();
                document.getElementById('loading').style.display = 'none';
                document.getElementById('progress').innerText = '';
            }
        };
        xhr.responseType = 'arraybuffer';
        xhr.send(formData);
        document.getElementById('loading').style.display = 'block';
    }
    form.classList.add('was-validated');
    return false;
}


// Manejar el clic en el botón de redimensionamiento
document.getElementById('resizeButton').addEventListener('click', function () {
    document.getElementById('resizeDiv').style.display = 'block';
    document.getElementById('convertDiv').style.display = 'none';
    document.getElementById('removeBackgroundDiv').style.display = 'none';
    document.getElementById('resizeButton').classList.add('active');
    document.getElementById('convertButton').classList.remove('active');
    document.getElementById('removeBackgroundButton').classList.remove('active');
});

// Manejar el clic en el botón de conversión
document.getElementById('convertButton').addEventListener('click', function () {
    document.getElementById('convertDiv').style.display = 'block';
    document.getElementById('resizeDiv').style.display = 'none';
    document.getElementById('removeBackgroundDiv').style.display = 'none';
    document.getElementById('convertButton').classList.add('active');
    document.getElementById('resizeButton').classList.remove('active');
    document.getElementById('removeBackgroundButton').classList.remove('active');
});

// Manejar el clic en el botón de eliminación de fondo
document.getElementById('removeBackgroundButton').addEventListener('click', function () {
    document.getElementById('removeBackgroundDiv').style.display = 'block';
    document.getElementById('resizeDiv').style.display = 'none';
    document.getElementById('convertDiv').style.display = 'none';
    document.getElementById('removeBackgroundButton').classList.add('active');
    document.getElementById('resizeButton').classList.remove('active');
    document.getElementById('convertButton').classList.remove('active');
});

// Manejar el paso del ratón sobre el logo de Teramont
document.getElementById('teramont-logo').addEventListener('mouseover', function () {
    this.style.filter = 'grayscale(0%)';
});

// Manejar la salida del ratón del logo de Teramont
document.getElementById('teramont-logo').addEventListener('mouseout', function () {
    this.style.filter = 'grayscale(100%)';
});

