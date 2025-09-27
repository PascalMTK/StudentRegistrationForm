const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
    return emailRegex.test(value);
}

function setValidationMessage(inputId, message = '') {
    const errorElement = document.getElementById(`err-${inputId}`);
    if (errorElement) errorElement.textContent = message;
}
