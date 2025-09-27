document.addEventListener('DOMContentLoaded', () => {
  const regForm = document.getElementById('regForm');
  const liveRegion = document.getElementById('live-region');

  regForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    let feedback = [];
    const isEditing = regForm.dataset.editingId;

    // Required fields validation
    ['firstName', 'lastName', 'email'].forEach(id => {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        setValidationMessage(id, 'This field is required.');
        isValid = false;
        feedback.push(`${input.labels[0].textContent} is required`);
      } else {
        setValidationMessage(id);
      }
    });

    // Email format validation
    const emailInput = document.getElementById('email');
    if (emailInput.value.trim() && !validateEmail(emailInput.value)) {
      setValidationMessage('email', 'Invalid email format.');
      isValid = false;
      feedback.push('Email format is invalid');
    } else {
      setValidationMessage('email');
    }

    // Programme select validation
    const programmeSelect = document.getElementById('programme');
    if (!programmeSelect.value) {
      setValidationMessage('programme', 'Please select a programme.');
      isValid = false;
      feedback.push('Programme selection is required');
    } else {
      setValidationMessage('programme');
    }

    // Year radio validation
    const year = regForm.querySelector('input[name="year"]:checked');
    if (!year) {
      setValidationMessage('year', 'Please select a year.');
      isValid = false;
      feedback.push('Year selection is required');
    } else {
      setValidationMessage('year');
    }

    // Handle Photo upload/data URL
    let photoDataUrl = 'assets/placeholder.png';
    const photoUpload = document.getElementById('photoUpload');
    const photoFile = photoUpload.files[0];
    const imagePreview = document.getElementById('imagePreview').querySelector('img');

    // 1. Get existing photo data if editing and no new file is uploaded
    if (isEditing && !photoFile && imagePreview.style.display !== 'none' && imagePreview.src) {
        photoDataUrl = imagePreview.src;
    }
    
    // 2. Read the new file if one is uploaded
    if (photoFile) {
      try {
        photoDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
      } catch (err) {
        console.error("File read error:", err);
      }
    }


    if (isValid) {
      const interestsText = document.getElementById('interests').value.trim();
      const interests = interestsText ? interestsText.split(',').map(i => i.trim()) : [];

      const formData = {
        id: isEditing ? parseInt(isEditing) : null, // Include ID if editing
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: emailInput.value.trim(),
        photo: photoDataUrl,
        programme: programmeSelect.value,
        year: year.value,
        interests
      };

      if (isEditing) {
        // Call the update function from 3studentManager.js
        updateStudent(formData);
      } else {
        // Call the add function from 3studentManager.js
        addStudent(formData);
      }
      
      // Reset form state after submission
      regForm.reset();
      delete regForm.dataset.editingId; // Clear the editing state
      document.querySelector('button[type="submit"]').textContent = 'Add Student';
      // Reset image preview using the logic from 4preview.js (or manually)
      imagePreview.style.display = 'none';
      imagePreview.src = '';
      document.getElementById('imagePreview').querySelector('p').style.display = 'block';

    } else {
      liveRegion.textContent = `❌ Submission failed: ${feedback.join('. ')}`;
    }
  });
});

// Function to populate the form with a student's data
function populateFormForEdit(studentId) {
    const student = getStudentById(studentId); 
    if (!student) return;

    // Set form fields with the student's data
    document.getElementById('firstName').value = student.firstName;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('email').value = student.email;
    document.getElementById('programme').value = student.programme;
    // Interests are stored as an array, convert to string for textarea
    document.getElementById('interests').value = Array.isArray(student.interests) ? student.interests.join(', ') : student.interests; 

    // Handle radio buttons for "Year of Study"
    const yearRadio = document.querySelector(`input[name="year"][value="${student.year}"]`);
    if (yearRadio) yearRadio.checked = true;

    // Handle photo preview
    const photoUpload = document.getElementById('photoUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = imagePreview.querySelector('img');
    const previewText = imagePreview.querySelector('p');

    // Clear file input so the user must re-select if they want to change the photo
    photoUpload.value = null; 

    if (student.photo && student.photo !== 'assets/placeholder.png') {
        previewImg.src = student.photo;
        previewImg.style.display = 'block';
        previewText.style.display = 'none';
    } else {
        previewImg.src = '';
        previewImg.style.display = 'none';
        previewText.style.display = 'block';
    }

    // Change form state to 'edit'
    document.getElementById('regForm').dataset.editingId = studentId;
    document.querySelector('button[type="submit"]').textContent = 'Update Student';
    
    // Scroll to the form for better user experience
    document.getElementById('regForm').scrollIntoView({ behavior: 'smooth' });
}