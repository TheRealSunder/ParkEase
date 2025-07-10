function validateAndProceed() {
    const email = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Hide login step and show user type selection
    document.getElementById('loginStep').style.display = 'none';
    document.getElementById('userTypeStep').style.display = 'block';
}

function selectUserType(userType) {
    // Route based on user type
    if (userType === 'driver') {
        window.location.href = 'home.html';
    } else if (userType === 'owner') {
        window.location.href = 'owner-dashboard.html';
    }
}

function goBackToLogin() {
    // Show login step and hide user type selection
    document.getElementById('loginStep').style.display = 'block';
    document.getElementById('userTypeStep').style.display = 'none';
}