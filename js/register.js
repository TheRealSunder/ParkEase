let selectedUserType = 'driver'; // Default selection

// Handle user type selection
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.user-type-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.user-type-option').forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update selected user type
            selectedUserType = this.getAttribute('data-type');
        });
    });
});

function handleRegister() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Route based on user type after successful registration
    if (selectedUserType === 'driver') {
        // Redirect to driver dashboard
        window.location.href = 'home.html';
    } else if (selectedUserType === 'owner') {
        // Redirect to owner dashboard
        window.location.href = 'owner-dashboard.html';
    }
}