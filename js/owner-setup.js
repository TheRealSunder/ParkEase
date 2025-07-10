let currentStep = 1;

function nextStep(step) {
    if (validateCurrentStep()) {
        currentStep = step;
        showStep(step);
        updateProgress(step);
        updateSummary();
    }
}

function prevStep(step) {
    currentStep = step;
    showStep(step);
    updateProgress(step);
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.setup-step').forEach(stepEl => {
        stepEl.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(`setupStep${step}`).style.display = 'block';
}

function updateProgress(step) {
    // Update progress indicators
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById(`step${i}`);
        const lineEl = document.getElementById(`line${i}`);
        
        if (i <= step) {
            stepEl.classList.add('active');
            if (lineEl && i < step) {
                lineEl.classList.add('active');
            }
        } else {
            stepEl.classList.remove('active');
            if (lineEl) {
                lineEl.classList.remove('active');
            }
        }
    }
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const name = document.getElementById('parkingName').value;
        const location = document.getElementById('parkingLocation').value;
        
        if (!name || !location) {
            alert('Please fill in all required fields');
            return false;
        }
    }
    return true;
}

function generateLevelInputs() {
    const levels = parseInt(document.getElementById('numberOfLevels').value);
    const container = document.getElementById('levelInputs');
    
    container.innerHTML = '';
    
    for (let i = 1; i <= levels; i++) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'form-group';
        levelDiv.innerHTML = `
            <label>Level ${i} Spaces</label>
            <input type="number" id="level${i}Spaces" placeholder="17" value="17" min="1" onchange="calculateTotal()">
        `;
        container.appendChild(levelDiv);
    }
    
    calculateTotal();
}

function calculateTotal() {
    const levels = parseInt(document.getElementById('numberOfLevels').value);
    let total = 0;
    
    for (let i = 1; i <= levels; i++) {
        const input = document.getElementById(`level${i}Spaces`);
        if (input) {
            total += parseInt(input.value) || 0;
        }
    }
    
    document.getElementById('totalSpaces').textContent = total;
    document.getElementById('summaryTotalSpaces').textContent = total;
    
    // Update walk-in slots calculation
    updateWalkinSlots();
}

function updateWalkinSlots() {
    const totalSpaces = parseInt(document.getElementById('totalSpaces').textContent) || 0;
    const reservationSlots = parseInt(document.getElementById('reservationSlots').value) || 0;
    const walkinSlots = Math.max(0, totalSpaces - reservationSlots);
    
    document.getElementById('summaryWalkinSlots').textContent = walkinSlots;
}

function updateSummary() {
    if (currentStep === 3) {
        const totalSpaces = document.getElementById('totalSpaces').textContent;
        const reservationSlots = document.getElementById('reservationSlots').value || '0';
        const hourlyRate = document.getElementById('hourlyRate').value || '25';
        
        document.getElementById('summaryTotalSpaces').textContent = totalSpaces;
        document.getElementById('summaryReservationSlots').textContent = reservationSlots;
        document.getElementById('summaryHourlyRate').textContent = `₱${hourlyRate}/hr`;
        
        updateWalkinSlots();
    }
}

function completeSetup() {
    // Collect all form data
    const setupData = {
        name: document.getElementById('parkingName').value,
        location: document.getElementById('parkingLocation').value,
        operatingHours: document.getElementById('operatingHours').value,
        levels: parseInt(document.getElementById('numberOfLevels').value),
        totalSpaces: parseInt(document.getElementById('totalSpaces').textContent),
        hourlyRate: parseInt(document.getElementById('hourlyRate').value),
        overnightRate: parseInt(document.getElementById('overnightRate').value) || 0,
        downpayment: parseInt(document.getElementById('downpayment').value),
        reservationSlots: parseInt(document.getElementById('reservationSlots').value),
        walkinSlots: parseInt(document.getElementById('summaryWalkinSlots').textContent)
    };

    // Save to localStorage
    localStorage.setItem('parkingAreaSetup', 'true');
    localStorage.setItem('parkingAreaData', JSON.stringify(setupData));

    // Show success modal
    document.getElementById('successName').textContent = setupData.name;
    document.getElementById('successSpaces').textContent = setupData.totalSpaces;
    document.getElementById('successRate').textContent = setupData.hourlyRate;
    document.getElementById('successModal').style.display = 'block';
}

function goToDashboard() {
    window.location.href = 'owner-dashboard.html';
}

function goBack() {
    if (currentStep === 1) {
        window.location.href = 'owner-dashboard.html';
    } else {
        prevStep(currentStep - 1);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateLevelInputs();
    
    // Add event listeners for real-time updates
    document.getElementById('reservationSlots').addEventListener('input', updateWalkinSlots);
    document.getElementById('hourlyRate').addEventListener('input', updateSummary);
});