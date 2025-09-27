let studentData = [];

// --- Helper Functions for HTML Generation ---

/**
 * Generates the inner HTML for a student profile card.
 */
function createStudentCardHTML(data) {
    const interestsHTML = data.interests.length 
        ? `<p><strong>Interests:</strong> ${data.interests.join(', ')}</p>` 
        : '';

    return `
        <img src="${data.photo}" alt="Photo of ${data.firstName} ${data.lastName}" onerror="this.src='assets/placeholder.png'">
        <h3>${data.firstName} ${data.lastName}</h3>
        <p>${data.email}</p>
        <div class="badges">
            <span class="badge">${data.programme}</span>
            <span class="badge">Year ${data.year}</span>
        </div>
        ${interestsHTML}
        <div>
            <button class="edit-btn">Edit</button>
            <button class="remove-btn">Remove</button>
        </div>
    `;
}

/**
 * Generates the inner HTML for a student summary table row.
 */
function createStudentTableRowHTML(data) {
    return `
        <td>${data.firstName} ${data.lastName}</td>
        <td>${data.programme}</td>
        <td>${data.year}</td>
        <td>
            <button class="remove-btn-table">Remove</button>
        </td>
    `;
}

// --- Helper Functions for Data and Events ---

/**
 * Retrieves a student by their unique ID.
 */
function getStudentById(id) {
    return studentData.find(student => student.id === parseInt(id));
}

/**
 * Attaches event listeners to the edit and remove buttons.
 */
function attachStudentListeners(id) {
    const card = document.querySelector(`.profile-card[data-id="${id}"]`);
    const tr = document.querySelector(`#summary-table tbody tr[data-id="${id}"]`);

    if (card) {
        card.querySelector('.remove-btn').addEventListener('click', () => removeStudent(id));
        card.querySelector('.edit-btn').addEventListener('click', () => populateFormForEdit(id));
    }
    if (tr) {
        tr.querySelector('.remove-btn-table').addEventListener('click', () => removeStudent(id));
    }
}

// --- Main DOM Update Function ---

/**
 * Updates the DOM elements (card and table row) after a student update.
 */
function updateCardAndRow(data) {
    // 1. Update the card
    const card = document.querySelector(`.profile-card[data-id="${data.id}"]`);
    if (card) {
        card.innerHTML = createStudentCardHTML(data);
        attachStudentListeners(data.id); 
    }

    // 2. Update the table row
    const tr = document.querySelector(`#summary-table tbody tr[data-id="${data.id}"]`);
    if (tr) {
        tr.innerHTML = createStudentTableRowHTML(data);
        attachStudentListeners(data.id);
    }
}

// --- Core CRUD Functions ---
function updateStudent(data) {
    const liveRegion = document.getElementById('live-region');
    
    // 1. Update the student in the array
    const index = studentData.findIndex(student => student.id === data.id);
    if (index !== -1) {
        studentData[index] = data;
        
        // 2. Update the DOM
        updateCardAndRow(data);
        
        liveRegion.textContent = 'Student profile updated';
    } else {
        liveRegion.textContent = 'Error: Student not found for update';
    }
}

function addStudent(data) {
    const cardsContainer = document.getElementById('cards-container');
    const summaryTableBody = document.querySelector('#summary-table tbody');
    const liveRegion = document.getElementById('live-region');
    
    // Assign a unique ID and store data
    const id = Date.now();
    data.id = id;
    studentData.unshift(data); 

    // 1. Create and insert Card
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.dataset.id = id;
    card.innerHTML = createStudentCardHTML(data);
    cardsContainer.prepend(card);

    // 2. Create and insert Table row
    const tr = document.createElement('tr');
    tr.dataset.id = id;
    tr.innerHTML = createStudentTableRowHTML(data);
    summaryTableBody.prepend(tr);

    // 3. Attach event handlers
    attachStudentListeners(id);

    liveRegion.textContent = 'Student profile added';
}

/**
 * Removes a student from the data and DOM.
 */
function removeStudent(id) {
    const cardsContainer = document.getElementById('cards-container');
    const summaryTableBody = document.querySelector('#summary-table tbody');
    const liveRegion = document.getElementById('live-region');

    // Remove from the data array
    studentData = studentData.filter(student => student.id !== id);

    // Remove from the DOM
    cardsContainer.querySelector(`.profile-card[data-id="${id}"]`)?.remove();
    summaryTableBody.querySelector(`tr[data-id="${id}"]`)?.remove();
    
    liveRegion.textContent = 'Student profile removed';
}