let selectedPaymentMethod = null;
let currentSessionData = null;

// Sample parking sessions (mechanical turk database)
const parkingSessions = {
    'PK-2024-1127-001': {
        type: 'walk-in',
        entryTime: '1:30 PM',
        qrId: 'PK-2024-1127-001',
        downpayment: 0
    },
    'PK-2024-1127-002': {
        type: 'reserved',
        entryTime: '10:15 AM',
        qrId: 'PK-2024-1127-002',
        downpayment: 50
    },
    'PK-2024-1127-003': {
        type: 'walk-in',
        entryTime: '2:00 PM',
        qrId: 'PK-2024-1127-003',
        downpayment: 0
    }
};

function validateQRInput() {
    const qrInput = document.getElementById('qrIdInput').value.trim();
    const findBtn = document.getElementById('findSessionBtn');
    
    if (qrInput.length > 0) {
        findBtn.disabled = false;
    } else {
        findBtn.disabled = true;
    }
}

function findParkingSession() {
    const qrId = document.getElementById('qrIdInput').value.trim();
    
    // Check if session exists in our mechanical turk database
    if (parkingSessions[qrId]) {
        currentSessionData = parkingSessions[qrId];
        calculateFees();
        showStep('feeCalculationStep');
    } else {
        alert('QR Code not found in system. Please check the ID and try again.');
    }
}

function calculateFees() {
    if (!currentSessionData) return;
    
    // Calculate parking duration and fees
    const now = new Date();
    const exitTimeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    // Simulate duration calculation (mechanical turk)
    const durationMinutes = Math.floor(Math.random() * 180) + 60; // 1-4 hours
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const durationString = `${hours}h ${minutes}m`;
    
    // Calculate fees
    const hourlyRate = 25;
    const baseRate = Math.ceil(durationMinutes / 60) * hourlyRate;
    const totalDue = Math.max(0, baseRate - currentSessionData.downpayment);
    
    // Update UI
    document.getElementById('sessionQrId').textContent = `#${currentSessionData.qrId}`;
    document.getElementById('sessionType').textContent = currentSessionData.type === 'reserved' ? 'Reserved' : 'Walk-in';
    document.getElementById('entryTime').textContent = currentSessionData.entryTime;
    document.getElementById('exitTime').textContent = exitTimeString;
    document.getElementById('totalDuration').textContent = durationString;
    document.getElementById('baseRate').textContent = `₱${baseRate}`;
    document.getElementById('totalAmountDue').textContent = `₱${totalDue}`;
    
    // Show downpayment if reserved customer
    if (currentSessionData.downpayment > 0) {
        document.getElementById('downpaymentRow').style.display = 'flex';
        document.getElementById('downpayment').textContent = `-₱${currentSessionData.downpayment}`;
    }
    
    // Store calculated values for later use
    currentSessionData.exitTime = exitTimeString;
    currentSessionData.duration = durationString;
    currentSessionData.baseRate = baseRate;
    currentSessionData.totalDue = totalDue;
}

function selectPaymentMethod(method) {
    // Remove previous selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-method="${method}"]`);
    selectedOption.classList.add('selected');
    
    selectedPaymentMethod = method;
    document.getElementById('processPaymentBtn').disabled = false;
}

function processPayment() {
    if (!selectedPaymentMethod) return;
    
    if (selectedPaymentMethod === 'cash') {
        showCashPayment();
    } else {
        showDigitalPayment(selectedPaymentMethod);
    }
    
    showStep('paymentProcessingStep');
}

function showCashPayment() {
    document.getElementById('paymentTitle').textContent = 'Cash Payment';
    document.getElementById('paymentSubtitle').textContent = 'Collect payment from customer';
    document.getElementById('cashAmount').textContent = `₱${currentSessionData.totalDue}`;
    document.getElementById('cashPaymentSection').style.display = 'block';
    document.getElementById('digitalPaymentSection').style.display = 'none';
}

function showDigitalPayment(method) {
    const methodName = method === 'gcash' ? 'GCash' : 'Maya';
    document.getElementById('paymentTitle').textContent = `${methodName} Payment`;
    document.getElementById('paymentSubtitle').textContent = `Show QR code to customer`;
    document.getElementById('qrPaymentAmount').textContent = `₱${currentSessionData.totalDue}`;
    document.getElementById('qrInstructionTitle').textContent = `Show QR to customer`;
    document.getElementById('qrInstructionText').textContent = `Customer scans with ${methodName} app to pay`;
    document.getElementById('cashPaymentSection').style.display = 'none';
    document.getElementById('digitalPaymentSection').style.display = 'block';
}

function confirmCashPayment() {
    completeExit('Cash');
}

function confirmDigitalPayment() {
    const methodName = selectedPaymentMethod === 'gcash' ? 'GCash' : 'Maya';
    completeExit(methodName);
}

function completeExit(paymentMethod) {
    // Update receipt with session data
    const now = new Date();
    document.getElementById('receiptDate').textContent = now.toLocaleDateString() + ' - ' + now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    document.getElementById('receiptQrId').textContent = `#${currentSessionData.qrId}`;
    document.getElementById('receiptEntryTime').textContent = currentSessionData.entryTime;
    document.getElementById('receiptExitTime').textContent = currentSessionData.exitTime;
    document.getElementById('receiptDuration').textContent = currentSessionData.duration;
    document.getElementById('receiptTotalPaid').textContent = `₱${currentSessionData.baseRate}`;
    document.getElementById('receiptPaymentMethod').textContent = paymentMethod;
    
    // Show downpayment on receipt if applicable
    if (currentSessionData.downpayment > 0) {
        document.getElementById('receiptDownpaymentRow').style.display = 'flex';
    }
    
    showStep('completionStep');
    
    // Simulate database logging
    setTimeout(() => {
        console.log('Exit logged to database:', {
            qrId: currentSessionData.qrId,
            type: currentSessionData.type,
            entryTime: currentSessionData.entryTime,
            exitTime: currentSessionData.exitTime,
            duration: currentSessionData.duration,
            totalPaid: currentSessionData.baseRate,
            paymentMethod: paymentMethod
        });
    }, 1000);
}

function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.exit-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(stepId).style.display = 'block';
}

function backToQREntry() {
    showStep('qrEntryStep');
    // Reset payment selection
    selectedPaymentMethod = null;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.getElementById('processPaymentBtn').disabled = true;
}

function backToFeeCalculation() {
    showStep('feeCalculationStep');
}

function startNewExit() {
    // Reset everything
    document.getElementById('qrIdInput').value = '';
    selectedPaymentMethod = null;
    currentSessionData = null;
    document.getElementById('findSessionBtn').disabled = true;
    document.getElementById('processPaymentBtn').disabled = true;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    showStep('qrEntryStep');
}

function returnToPOS() {
    window.location.href = 'owner-pos.html';
}