function submitForm(formId) {
    var form = document.getElementById(formId);
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
                document.getElementById('progress').innerText = '' + percentage.toFixed(2) + '%';
            }
        };

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                var fileInput = formId === 'resizeForm' ? document.getElementById('file') : document.getElementById('convertFile');
                var fileName = fileInput.files[0].name;
                var fileExtension = fileName.split('.').pop();
                var format = formId === 'resizeForm' ? 'resizeFormat' : 'convertFormat';
                var selectedFormat = document.getElementById(format).value.toLowerCase();
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


document.getElementById('resizeButton').addEventListener('click', function () {
    document.getElementById('resizeDiv').style.display = 'block';
    document.getElementById('convertDiv').style.display = 'none';
    document.getElementById('resizeButton').classList.add('active');
    document.getElementById('convertButton').classList.remove('active');
});

document.getElementById('convertButton').addEventListener('click', function () {
    document.getElementById('convertDiv').style.display = 'block';
    document.getElementById('resizeDiv').style.display = 'none';
    document.getElementById('convertButton').classList.add('active');
    document.getElementById('resizeButton').classList.remove('active');
});
