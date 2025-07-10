function searchReservations() {
    const searchTerm = document.getElementById('reservationSearch').value.toLowerCase();
    const reservationItems = document.querySelectorAll('.reservation-item');
    const noResults = document.getElementById('noResults');
    let hasVisibleResults = false;
    
    reservationItems.forEach(item => {
        const customerName = item.getAttribute('data-customer').toLowerCase();
        const customerPhone = item.getAttribute('data-phone').toLowerCase();
        
        if (searchTerm === '' || customerName.includes(searchTerm) || customerPhone.includes(searchTerm)) {
            item.style.display = 'block';
            hasVisibleResults = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (searchTerm !== '' && !hasVisibleResults) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

function selectReservation(element) {
    // Remove previous selection
    document.querySelectorAll('.reservation-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    element.classList.add('selected');
    
    // Get customer data
    const customerName = element.getAttribute('data-customer');
    const customerPhone = element.getAttribute('data-phone');
    const timeRemaining = element.querySelector('.status-timer').textContent;
    
    // Update confirmation step with customer data
    document.getElementById('selectedCustomerName').textContent = customerName;
    document.getElementById('selectedCustomerPhone').textContent = customerPhone;
    document.getElementById('selectedTimeRemaining').textContent = timeRemaining;
    document.getElementById('entryTime').textContent = new Date().toLocaleTimeString();
    
    // Generate avatar initials
    const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2);
    document.getElementById('customerAvatar').textContent = initials;
    
    // Show confirmation step
    document.getElementById('searchStep').style.display = 'none';
    document.getElementById('confirmStep').style.display = 'block';
}

function backToSearch() {
    // Clear selection
    document.querySelectorAll('.reservation-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Show search step
    document.getElementById('searchStep').style.display = 'block';
    document.getElementById('confirmStep').style.display = 'none';
}

function completeReservedEntry() {
    const customerName = document.getElementById('selectedCustomerName').textContent;
    const customerPhone = document.getElementById('selectedCustomerPhone').textContent;
    const entryTime = document.getElementById('entryTime').textContent;
    
    // Show completion message
    alert(`Reserved Entry Complete!\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nEntry Time: ${entryTime}\nDownpayment: ₱50 (already paid)\nStatus: Checked in\n\nCustomer can now park. Remaining payment due on exit.`);
    
    // Return to POS system
    window.location.href = 'owner-pos.html';
}

// Update timers every second
function updateTimers() {
    document.querySelectorAll('.status-timer').forEach(timer => {
        const currentTime = timer.textContent;
        const [minutes, seconds] = currentTime.split(':').map(n => parseInt(n));
        
        let totalSeconds = minutes * 60 + seconds;
        totalSeconds--;
        
        if (totalSeconds <= 0) {
            timer.textContent = 'Expired';
            timer.style.color = '#999';
        } else {
            const newMinutes = Math.floor(totalSeconds / 60);
            const newSeconds = totalSeconds % 60;
            timer.textContent = `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        }
    });
}

// Start timer updates
setInterval(updateTimers, 1000);