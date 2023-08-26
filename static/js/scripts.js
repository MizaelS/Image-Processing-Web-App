function submitForm(formId) {
    var form = document.getElementById(formId);
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var blob = new Blob([xhr.response], { type: 'application/octet-stream' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'output.' + document.getElementById('format').value.toLowerCase();
            link.click();
            document.getElementById('loading').style.display = 'none';
        }
    };
    xhr.responseType = 'arraybuffer';
    xhr.send(formData);
    document.getElementById('loading').style.display = 'block';
    return false;
}
