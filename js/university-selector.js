// University Selector - Shared functionality across all university pages

// University mapping for navigation
const universityPages = {
    dlsu: 'dlsu-home.html',
    ust: 'ust-home.html',
    ateneo: 'ateneo-home.html',
    nu: 'nu-home.html'
};

function showUniversityModal() {
    document.getElementById('universityModal').style.display = 'flex';
}

function hideUniversityModal() {
    document.getElementById('universityModal').style.display = 'none';
}

function selectUniversity(universityKey) {
    // Save the selection
    localStorage.setItem('selectedUniversity', universityKey);
    
    // Navigate to the appropriate university page
    const targetPage = universityPages[universityKey];
    if (targetPage && targetPage !== window.location.pathname.split('/').pop()) {
        window.location.href = targetPage;
    } else {
        // If already on the correct page, just close modal
        hideUniversityModal();
    }
}

// Handle modal interactions
document.addEventListener('DOMContentLoaded', function() {
    // Handle escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideUniversityModal();
        }
    });
    
    // Handle clicks outside modal content
    const modal = document.getElementById('universityModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                hideUniversityModal();
            }
        });
    }
});