function switchParkingType(type) {
    // Update tab appearance
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide sections
    if (type === 'public') {
        document.getElementById('publicSection').style.display = 'block';
        document.getElementById('privateSection').style.display = 'none';
    } else {
        document.getElementById('publicSection').style.display = 'none';
        document.getElementById('privateSection').style.display = 'block';
        // Set default date to today
        document.getElementById('privateDate').value = new Date().toISOString().split('T')[0];
    }
}

function filterReservations(filter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide reservations based on filter
    const reservations = document.querySelectorAll('.reservation-item');
    let visibleCount = 0;
    
    reservations.forEach(item => {
        const status = item.getAttribute('data-status');
        
        if (filter === 'all' || 
            (filter === 'active' && (status === 'active')) ||
            (filter === 'completed' && status === 'completed') ||
            (filter === 'cancelled' && status === 'cancelled')) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show empty state if no reservations visible
    const emptyState = document.getElementById('emptyState');
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        document.querySelectorAll('.reservations-section').forEach(section => {
            section.style.display = 'none';
        });
    } else {
        emptyState.style.display = 'none';
        document.querySelectorAll('.reservations-section').forEach(section => {
            section.style.display = 'block';
        });
    }
}

function searchPrivateParking() {
    const date = document.getElementById('privateDate').value;
    const time = document.getElementById('privateTime').value;
    const duration = document.getElementById('privateDuration').value;
    const university = document.getElementById('privateUniversity').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Simulate search - in real app would make API call
    alert(`Searching for private parking:\nDate: ${date}\nTime: ${time}\nDuration: ${duration} hours\nNear: ${university.toUpperCase()}`);
}

function bookPrivateSlot(slotId) {
    const slotData = {
        'one-archers-a15': {
            name: 'One Archer\'s Place - Tower A, Slot 15',
            location: '0.3 km from DLSU • 5 min walk',
            price: '₱200',
            duration: '8 hours',
            contact: 'Maria Santos - 0917-123-4567'
        },
        'residences-b8': {
            name: 'The Residences - Building B, Slot 8',
            location: '0.5 km from DLSU • 7 min walk', 
            price: '₱150',
            duration: '8 hours',
            contact: 'Juan Cruz - 0926-876-5432'
        },
        'malate-towers-23': {
            name: 'Malate Towers - Unit 15A, Slot 23',
            location: '0.7 km from DLSU • 9 min walk',
            price: '₱120',
            duration: '8 hours',
            contact: 'Anna Reyes - 0915-555-7890'
        }
    };
    
    const slot = slotData[slotId];
    if (!slot) return;
    
    if (confirm(`Book ${slot.name}?\n\nDeposit: ₱50 (paid now)\nRemaining: Pay on arrival\n\nYou'll receive contact details after booking.`)) {
        // Add booking to private bookings section
        addPrivateBooking(slotId, slot);
        
        alert(`Booking confirmed!\n\n${slot.name} is now reserved.\nDeposit charged: ₱50\n\nCheck "My Private Bookings" for contact details.`);
    }
}

function addPrivateBooking(slotId, slotData) {
    const privateBookings = document.getElementById('privateBookings');
    
    // Remove empty state if it exists
    const emptyState = privateBookings.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create booking item
    const bookingItem = document.createElement('div');
    bookingItem.className = 'private-booking-item';
    bookingItem.setAttribute('data-slot-id', slotId);
    
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + 8 * 60 * 60 * 1000); // 8 hours later
    
    bookingItem.innerHTML = `
        <div class="booking-header">
            <div class="booking-info">
                <div class="booking-title">${slotData.name}</div>
                <div class="booking-location">${slotData.location}</div>
                <div class="booking-time">Today, 9:00 AM - 5:00 PM</div>
            </div>
            <div class="booking-status">
                <span class="status-badge confirmed">Confirmed</span>
            </div>
        </div>
        <div class="booking-details">
            <div class="detail-item">
                <span>Total Cost:</span>
                <span>${slotData.price}</span>
            </div>
            <div class="detail-item">
                <span>Deposit Paid:</span>
                <span>₱50</span>
            </div>
            <div class="detail-item">
                <span>Remaining:</span>
                <span>${parseInt(slotData.price.replace('₱', '')) - 50}</span>
            </div>
            <div class="detail-item">
                <span>Contact:</span>
                <span>${slotData.contact}</span>
            </div>
        </div>
        <div class="booking-actions">
            <button class="contact-btn" onclick="contactOwner('${slotId}')">
                Contact Owner
            </button>
            <button class="cancel-booking-btn" onclick="cancelPrivateBooking('${slotId}')">
                Cancel Booking
            </button>
        </div>
    `;
    
    privateBookings.appendChild(bookingItem);
}

function contactOwner(slotId) {
    const slotContacts = {
        'one-archers-a15': 'Maria Santos - 0917-123-4567',
        'residences-b8': 'Juan Cruz - 0926-876-5432',
        'malate-towers-23': 'Anna Reyes - 0915-555-7890'
    };
    
    const contact = slotContacts[slotId];
    if (contact) {
        alert(`Contact Details:\n\n${contact}\n\n(In a real app, this would open your phone's dialer or messaging app)`);
    }
}

function cancelPrivateBooking(slotId) {
    if (confirm('Cancel this private parking booking?\n\nYour ₱50 deposit will not be refunded.')) {
        const bookingItem = document.querySelector(`[data-slot-id="${slotId}"]`);
        if (bookingItem) {
            bookingItem.remove();
        }
        
        // Show empty state if no bookings left
        const privateBookings = document.getElementById('privateBookings');
        if (privateBookings.children.length === 0) {
            privateBookings.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <div class="empty-text">No Private Bookings Yet</div>
                    <div class="empty-subtext">
                        Book a private parking slot to see your reservations here.
                    </div>
                </div>
            `;
        }
        
        alert('Private booking cancelled. Deposit is non-refundable.');
    }
}

function cancelReservation(parkingId) {
    if (confirm('Are you sure you want to cancel this reservation? Your ₱50 downpayment will not be refunded.')) {
        alert('Reservation cancelled. Downpayment is non-refundable as per policy.');
        // In real app, would update the reservation status
    }
}

function getDirections() {
    alert('Opening directions to parking location...\n\n(In a real app, this would open Maps with navigation)');
}

function checkoutParking(parkingId) {
    alert('Processing checkout...\n\nTotal amount: ₱80\nPayment confirmed!');
}

function leaveReview(parkingId) {
    const rating = prompt('Rate your parking experience (1-5 stars):');
    if (rating && rating >= 1 && rating <= 5) {
        alert(`Thank you for your ${rating}-star review!`);
    }
}

// Start timers for demo purposes
function startTimers() {
    // Start reservation timer (countdown)
    const reservedItem = document.querySelector('.reservation-item.reserved');
    if (reservedItem) {
        const timeDisplay = reservedItem.querySelector('.timer-display');
        startReservationTimer(timeDisplay, 24 * 60 + 32); // 24:32
    }
    
    // Ongoing timer (counting up)
    let ongoingTime = 1 * 60 + 45; // 1h 45m in minutes
    const ongoingDisplay = document.querySelector('.ongoing-display');
    const costDisplay = document.querySelector('.current-cost');
    
    const ongoingTimer = setInterval(() => {
        const hours = Math.floor(ongoingTime / 60);
        const minutes = ongoingTime % 60;
        
        if (ongoingDisplay) {
            ongoingDisplay.textContent = `${hours}h ${minutes}m`;
        }
        
        // Calculate cost (₱45 base + ₱20/hr for additional time)
        const additionalHours = Math.max(0, ongoingTime - 0);
        const additionalCost = Math.ceil(additionalHours / 60) * 20;
        const totalCost = 45 + additionalCost;
        
        if (costDisplay) {
            costDisplay.textContent = `Current Cost: ₱${totalCost}`;
        }
        
        ongoingTime++;
    }, 60000); // Update every minute
}

function startReservationTimer(element, timeInSeconds) {
    const timer = setInterval(() => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        
        if (element) {
            element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (timeInSeconds <= 0) {
            clearInterval(timer);
            if (element) {
                element.textContent = 'Expired';
            }
        }
        
        timeInSeconds--;
    }, 1000);
}

// Add dynamic slot updates for home.html simulation
function simulateLiveSlotUpdates() {
    // This function will be used in home.html
    const parkingSlots = document.querySelectorAll('.slots-available');
    
    setInterval(() => {
        parkingSlots.forEach(slotElement => {
            // Skip if it's the "0 slots" one (DLSU Razon - always full)
            if (slotElement.textContent.includes('0 slots')) {
                return;
            }
            
            // Get current number
            const currentText = slotElement.textContent;
            const currentNumber = parseInt(currentText.match(/\d+/)[0]);
            
            // Random change: -1, 0, or +1
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let newNumber = currentNumber + change;
            
            // Keep it between 1 and 20 (reasonable parking limits)
            newNumber = Math.max(1, Math.min(20, newNumber));
            
            // Update the text
            slotElement.textContent = `${newNumber} slots`;
            
            // Update CSS class based on availability
            slotElement.className = 'slots-available';
            if (newNumber <= 3) {
                slotElement.classList.add('slots-limited');
            } else if (newNumber === 0) {
                slotElement.classList.add('slots-full');
            }
        });
    }, 10000); // Every 10 seconds
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    startTimers();
    // Set default date to today for private parking
    document.getElementById('privateDate').value = new Date().toISOString().split('T')[0];
});