document.addEventListener('DOMContentLoaded', function() {
    // ----- SECTION 1: service form with validation -----
    const serviceForm = document.getElementById('serviceForm');
    const formError = document.getElementById('formError');

    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();  // block actual submit

        const name = document.getElementById('applicantName').value.trim();
        const email = document.getElementById('applicantEmail').value.trim();

        // basic validation
        if (name === '') {
            formError.textContent = '❌ Name is required.';
            return;
        }
        if (email === '') {
            formError.textContent = '❌ Email is required.';
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            formError.textContent = '❌ Please enter a valid email address.';
            return;
        }

        // if all good
        formError.textContent = '✅ Application sent! (demo)';
        serviceForm.reset();  // optional: clear form
        // clear success message after 3 seconds
        setTimeout(() => { formError.textContent = ''; }, 3000);
    });

    // ----- SECTION 2: table with search & loading animation -----
    const searchBtn = document.getElementById('searchBtn');
    const tableBody = document.getElementById('tableBody');

    // sample dog data
    const dogData = [
        { name: 'Luna', breed: 'Labrador Retriever', age: 2 },
        { name: 'Charlie', breed: 'Beagle', age: 4 },
        { name: 'Bella', breed: 'Poodle', age: 1 },
        { name: 'Max', breed: 'German Shepherd', age: 5 },
        { name: 'Coco', breed: 'Golden Retriever', age: 3 },
    ];

    searchBtn.addEventListener('click', function() {
        // show loading animation
        tableBody.innerHTML = `
            <tr class="loading">
                <td colspan="3">
                    <span class="spinner"></span> Searching for good dogs...
                </td>
            </tr>
        `;

        // after 3 seconds, populate with real data
        setTimeout(() => {
            let rows = '';
            dogData.forEach(dog => {
                rows += `
                    <tr>
                        <td>${dog.name}</td>
                        <td>${dog.breed}</td>
                        <td>${dog.age}</td>
                    </tr>
                `;
            });
            tableBody.innerHTML = rows;
        }, 3000);
    });

    // ----- SECTION 3: profile form → profile card -----
    const profileForm = document.getElementById('profileForm');
    const profileContainer = document.getElementById('profileContainer');

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const owner = document.getElementById('ownerName').value.trim();
        const dogName = document.getElementById('dogNameProfile').value.trim();
        const breed = document.getElementById('dogBreed').value.trim() || 'unknown breed';

        // simple validation
        if (owner === '' || dogName === '') {
            alert('Please fill in both owner and dog name.');
            return;
        }

        // create a new profile card
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div>
                <p><strong>${dogName}</strong> (${breed})</p>
                <p>Owner: ${owner}</p>
            </div>
        `;

        // append to container
        profileContainer.appendChild(card);

        // optionally reset form
        profileForm.reset();
    });
});