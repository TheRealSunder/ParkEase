// Simulate real-time slot updates
let availableSlots = 4;
let occupiedSlots = 46;
let reservedSlots = 2;
const totalSlots = 50;

function updateSlotDisplay() {
    document.getElementById('availableSlots').textContent = availableSlots;
    document.getElementById('occupiedSlots').textContent = occupiedSlots;
    document.getElementById('reservedSlots').textContent = reservedSlots;
}

function handleEntry(type) {
    if (type === 'walkin') {
        showWalkinEntrySection();
    } else if (type === 'reserved') {
        window.location.href = 'reserved-entry.html';
    }
}

function showWalkinEntrySection() {
    // Hide main interface
    document.querySelector('.slot-counter-section').style.display = 'none';
    document.querySelector('.action-section').style.display = 'none';
    document.querySelector('.summary-section').style.display = 'none';
    
    // Show walk-in entry section
    document.getElementById('walkinEntrySection').style.display = 'block';
    
    // Reset to first step
    showEntryStep('qrStep');
    generateNewQR();
}

function showMainInterface() {
    // Hide all entry sections
    document.getElementById('walkinEntrySection').style.display = 'none';
    
    // Show main interface
    document.querySelector('.slot-counter-section').style.display = 'block';
    document.querySelector('.action-section').style.display = 'block';
    document.querySelector('.summary-section').style.display = 'block';
}

function showEntryStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.entry-step').forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStep = document.getElementById(stepId);
    currentStep.style.display = 'block';
    currentStep.classList.add('active');
}

function nextEntryStep(stepId) {
    if (stepId === 'confirmStep') {
        showEntryStep('confirmStep');
        // Update the confirmation details
        const qrId = document.querySelector('.qr-id').textContent.replace('ID: ', '');
        const currentTime = new Date().toLocaleTimeString();
        document.getElementById('confirmQrId').textContent = qrId;
        document.getElementById('entryTime').textContent = currentTime;
    }
}

function prevEntryStep(stepId) {
    showEntryStep(stepId);
}

function generateNewQR() {
    // Generate a new QR ID
    const now = new Date();
    const qrId = `PK-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    document.querySelector('.qr-id').textContent = `ID: #${qrId}`;
}

function cancelQR() {
    if (confirm('Cancel this QR code? Customer will not be logged.')) {
        // Return to main interface without logging anything
        showMainInterface();
    }
}

function completeWalkinEntry() {
    const qrId = document.querySelector('.qr-id').textContent.replace('ID: #', '');
    const entryTime = document.getElementById('entryTime').textContent;
    
    // Update slot counter
    if (availableSlots > 0) {
        availableSlots--;
        occupiedSlots++;
        updateSlotDisplay();
        
        // Update today's entries count
        const entriesElement = document.getElementById('todayEntries');
        const currentEntries = parseInt(entriesElement.textContent);
        entriesElement.textContent = currentEntries + 1;
    }
    
    // Show completion message
    alert(`Entry Logged Successfully!\n\nQR ID: ${qrId}\nEntry Time: ${entryTime}\nStatus: Logged in database\n\nCustomer can now park. They'll need their QR code for checkout.`);
    
    // Return to main interface
    showMainInterface();
}

function handleExit() {
    window.location.href = 'customer-exit.html';
}

function openSettings() {
    window.location.href = 'parking-settings.html';
}

function initializeSettings() {
    const settings = JSON.parse(localStorage.getItem('parkingSettings')) || {
        initialRate: 30,
        hourlyRate: 25,
        downpayment: 50
    };

    // Update settings display in the button subtitle
    const settingsBtn = document.querySelector('.settings-btn .btn-subtitle');
    if (settingsBtn) {
        settingsBtn.textContent = `₱${settings.initialRate} initial • ₱${settings.hourlyRate}/hr`;
    }
}

// Simulate live updates (for demo)
function startLiveUpdates() {
    setInterval(() => {
        // Random small changes to simulate real activity
        if (Math.random() < 0.1) { // 10% chance per interval
            const change = Math.random() < 0.5 ? -1 : 1;
            if (availableSlots + change >= 0 && availableSlots + change <= totalSlots) {
                availableSlots += change;
                occupiedSlots -= change;
                updateSlotDisplay();
            }
        }
    }, 3000); // Every 3 seconds
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize display
    updateSlotDisplay();
    initializeSettings();
    
    // Start live updates
    startLiveUpdates();
});