function manageParkingOperations() {
    // Route to POS system for daily operations
    window.location.href = 'owner-pos.html';
}

function setupParkingArea() {
    // Route to setup wizard
    window.location.href = 'owner-setup.html';
}

function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        window.location.href = 'index.html';
    }
}

// Load parking area data (simulate)
function loadParkingData() {
    // In real app, this would load from database
    console.log('Loading parking area data...');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', loadParkingData);