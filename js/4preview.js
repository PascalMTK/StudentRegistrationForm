document.addEventListener('DOMContentLoaded', () => {
    const photoUpload = document.getElementById('photoUpload');
    const previewContainer = document.getElementById('imagePreview');
    const previewImage = previewContainer.querySelector('img');
    const previewText = previewContainer.querySelector('p');

    photoUpload?.addEventListener('change', () => {
    const file = photoUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        previewText.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.src = '';
        previewImage.style.display = 'none';
        previewText.style.display = 'block';
    }
    });
});
