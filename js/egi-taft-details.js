function startReservation() {
    document.getElementById('confirmModal').style.display = 'flex';
}

function closeConfirmation() {
    document.getElementById('confirmModal').style.display = 'none';
}

function confirmReservation() {
    // Close confirmation modal
    document.getElementById('confirmModal').style.display = 'none';
    
    // Calculate expiration time (30 minutes from now)
    const now = new Date();
    const expiration = new Date(now.getTime() + 30 * 60000);
    document.getElementById('expirationTime').textContent = expiration.toLocaleTimeString();
    
    // Update available slots
    const slotsElement = document.getElementById('availableSlots');
    const currentSlots = parseInt(slotsElement.textContent);
    slotsElement.textContent = currentSlots - 1;
    
    // Save reservation to localStorage
    localStorage.setItem('egiTaftReservation', 'true');
    localStorage.setItem('reservationTime', new Date().toISOString());
    
    // Show success modal
    document.getElementById('successModal').style.display = 'flex';
    
    // Disable reserve button
    const reserveBtn = document.getElementById('reserveButton');
    reserveBtn.textContent = 'Spot Reserved';
    reserveBtn.disabled = true;
    reserveBtn.style.background = '#999';
    reserveBtn.style.cursor = 'not-allowed';
}

function viewReservations() {
    window.location.href = 'reservations.html';
}

function goHome() {
    document.getElementById('successModal').style.display = 'none';
    window.location.href = 'home.html';
}