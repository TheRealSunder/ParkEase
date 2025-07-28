// Private Parking - University-specific slots

// University data for private parking
const universityData = {
    dlsu: {
        name: "DLSU Campus",
        fullName: "De La Salle University",
        location: "Manila",
        privateSlots: [
            {
                id: 'one-archers-a15',
                title: 'One Archer\'s Place - Tower A',
                distance: '0.3 km from DLSU • 5 min walk',
                details: 'Level 2, Slot 15 • Covered parking',
                price: 200,
                rating: 4.8,
                reviews: 12,
                owner: 'Maria Santos',
                contact: '0917-123-4567'
            },
            {
                id: 'the-residences-b8',
                title: 'The Residences - Building B',
                distance: '0.5 km from DLSU • 7 min walk',
                details: 'Ground floor, Slot 8 • Easy access',
                price: 150,
                rating: 4.5,
                reviews: 8,
                owner: 'Juan Cruz',
                contact: '0926-876-5432'
            },
            {
                id: 'malate-towers-23',
                title: 'Malate Towers - Unit 15A',
                distance: '0.7 km from DLSU • 9 min walk',
                details: 'Basement 1, Slot 23 • Secure parking',
                price: 120,
                rating: 5.0,
                reviews: 3,
                owner: 'Anna Reyes',
                contact: '0915-555-7890'
            }
        ]
    },
    ust: {
        name: "UST Campus",
        fullName: "University of Santo Tomas",
        location: "Manila",
        privateSlots: [
            {
                id: 'centro-residences-c12',
                title: 'Centro Residences - Building C',
                distance: '0.2 km from UST • 3 min walk',
                details: 'Level 3, Slot 12 • Covered parking',
                price: 180,
                rating: 4.6,
                reviews: 15,
                owner: 'Carlos Mendoza',
                contact: '0918-234-5678'
            },
            {
                id: 'sampaloc-tower-d5',
                title: 'Sampaloc Tower - Unit D5',
                distance: '0.4 km from UST • 6 min walk',
                details: 'Ground level, Slot 5 • Security guard',
                price: 140,
                rating: 4.3,
                reviews: 9,
                owner: 'Lisa Garcia',
                contact: '0927-987-6543'
            },
            {
                id: 'españa-plaza-b7',
                title: 'España Plaza - Building B',
                distance: '0.6 km from UST • 8 min walk',
                details: 'Basement 2, Slot 7 • Well-lit area',
                price: 110,
                rating: 4.7,
                reviews: 6,
                owner: 'Roberto Silva',
                contact: '0916-666-7777'
            }
        ]
    },
    ateneo: {
        name: "Ateneo Campus",
        fullName: "Ateneo de Manila University",
        location: "Quezon City",
        privateSlots: [
            {
                id: 'loyola-heights-a3',
                title: 'Loyola Heights Residence - A3',
                distance: '0.3 km from Ateneo • 4 min walk',
                details: 'Covered slot, Level 1 • Near gate',
                price: 220,
                rating: 4.9,
                reviews: 18,
                owner: 'Patricia Lim',
                contact: '0919-345-6789'
            },
            {
                id: 'katipunan-condo-b15',
                title: 'Katipunan Condominium - B15',
                distance: '0.5 km from Ateneo • 7 min walk',
                details: 'Ground floor, Slot 15 • CCTV monitored',
                price: 190,
                rating: 4.4,
                reviews: 11,
                owner: 'Michael Tan',
                contact: '0928-111-2222'
            },
            {
                id: 'xavierville-house-c9',
                title: 'Xavierville Private House - C9',
                distance: '0.8 km from Ateneo • 10 min walk',
                details: 'Driveway parking • Residential area',
                price: 160,
                rating: 4.2,
                reviews: 7,
                owner: 'Grace Wong',
                contact: '0917-888-9999'
            }
        ]
    },
    nu: {
        name: "NU Campus",
        fullName: "National University",
        location: "Manila",
        privateSlots: [
            {
                id: 'nu-towers-d8',
                title: 'NU Towers - Building D',
                distance: '0.2 km from NU • 3 min walk',
                details: 'Level 2, Slot 8 • Elevator access',
                price: 170,
                rating: 4.5,
                reviews: 13,
                owner: 'Jenny Lopez',
                contact: '0920-456-7890'
            },
            {
                id: 'sampaloc-plaza-e4',
                title: 'Sampaloc Plaza - Unit E4',
                distance: '0.4 km from NU • 5 min walk',
                details: 'Ground level, Slot 4 • Near jeepney stop',
                price: 130,
                rating: 4.1,
                reviews: 8,
                owner: 'Mark Rivera',
                contact: '0929-222-3333'
            },
            {
                id: 'jhocson-residence-f6',
                title: 'Jhocson Street Residence - F6',
                distance: '0.6 km from NU • 8 min walk',
                details: 'Private garage • Quiet neighborhood',
                price: 100,
                rating: 4.8,
                reviews: 5,
                owner: 'Sarah Kim',
                contact: '0918-777-8888'
            }
        ]
    }
};

// Current selected university
let currentUniversity = 'dlsu'; // Default to DLSU

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved university preference
    const savedUniversity = localStorage.getItem('selectedUniversity') || 'dlsu';
    currentUniversity = savedUniversity;
    
    updateLocationDisplay();
    loadPrivateSlots();
    
    // Set default date to today
    document.getElementById('privateDate').value = new Date().toISOString().split('T')[0];
});

function updateLocationDisplay() {
    const university = universityData[currentUniversity];
    
    // Update location display
    document.getElementById('currentLocationName').textContent = `${university.name}, ${university.location}`;
    document.getElementById('locationSubtitle').textContent = `Find private parking slots near ${university.name}`;
    
    // Update results count
    const slotsCount = university.privateSlots.length;
    document.getElementById('resultsCount').textContent = `${slotsCount} slots found near ${university.name}`;
    
    // Update modal selection
    updateUniversityModalSelection();
}

function loadPrivateSlots() {
    const university = universityData[currentUniversity];
    const resultsContainer = document.getElementById('privateResults');
    
    resultsContainer.innerHTML = '';
    
    university.privateSlots.forEach(slot => {
        const slotCard = createPrivateSlotCard(slot);
        resultsContainer.appendChild(slotCard);
    });
}

function createPrivateSlotCard(slot) {
    const card = document.createElement('div');
    card.className = 'private-listing-card';
    card.style.cursor = 'pointer';
    card.onclick = () => viewSlotDetails(slot.id);
    
    card.innerHTML = `
        <div class="listing-header">
            <div class="listing-info">
                <div class="listing-title">${slot.title}</div>
                <div class="listing-distance">${slot.distance}</div>
                <div class="listing-details">${slot.details}</div>
            </div>
            <div class="listing-price">
                <div class="price-amount">₱${slot.price}</div>
                <div class="price-duration">8 hours</div>
            </div>
        </div>
        <div class="listing-meta">
            <div class="listing-time">Today, 9:00 AM - 5:00 PM</div>
            <div class="listing-rating">⭐ ${slot.rating} (${slot.reviews} reviews)</div>
        </div>
        <div class="listing-actions">
            <button class="book-btn" onclick="event.stopPropagation(); bookPrivateSlot('${slot.id}')">
                Book Now - ₱50 deposit
            </button>
        </div>
    `;
    
    return card;
}

// Function to navigate to slot details page
function viewSlotDetails(slotId) {
    localStorage.setItem('currentSlotId', slotId);
    window.location.href = `private-slot-details.html?slot=${slotId}`;
}

function updateUniversityModalSelection() {
    // Remove all selected states
    document.querySelectorAll('.university-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected state to current university
    const currentOption = document.querySelector(`[data-university="${currentUniversity}"]`);
    if (currentOption) {
        currentOption.classList.add('selected');
    }
}

function showUniversityModal() {
    document.getElementById('universityModal').style.display = 'flex';
    updateUniversityModalSelection();
}

function hideUniversityModal() {
    document.getElementById('universityModal').style.display = 'none';
}

function selectUniversity(universityKey) {
    currentUniversity = universityKey;
    localStorage.setItem('selectedUniversity', universityKey);
    
    updateLocationDisplay();
    loadPrivateSlots();
    hideUniversityModal();
}

function searchPrivateParking() {
    const date = document.getElementById('privateDate').value;
    const time = document.getElementById('privateTime').value;
    const duration = document.getElementById('privateDuration').value;
    const maxDistance = document.getElementById('maxDistance').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Show loading state
    document.getElementById('resultsCount').textContent = 'Searching...';
    
    // Simulate search delay
    setTimeout(() => {
        const university = universityData[currentUniversity];
        
        // Filter by distance (for demo purposes, just filter randomly)
        let filteredSlots = university.privateSlots;
        if (maxDistance < 1) {
            filteredSlots = university.privateSlots.filter(slot => 
                parseFloat(slot.distance.split(' ')[0]) <= maxDistance
            );
        }
        
        // Update results
        document.getElementById('resultsCount').textContent = 
            `${filteredSlots.length} slots found near ${university.name}`;
        
        // Reload slots with filtered results
        const resultsContainer = document.getElementById('privateResults');
        resultsContainer.innerHTML = '';
        
        filteredSlots.forEach(slot => {
            const slotCard = createPrivateSlotCard(slot);
            resultsContainer.appendChild(slotCard);
        });
        
        if (filteredSlots.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🚗</div>
                    <div class="empty-text">No slots found</div>
                    <div class="empty-subtext">
                        Try adjusting your search filters or increasing the distance range.
                    </div>
                </div>
            `;
        }
    }, 800);
}

function bookPrivateSlot(slotId) {
    const university = universityData[currentUniversity];
    const slot = university.privateSlots.find(s => s.id === slotId);
    
    if (!slot) return;
    
    if (confirm(`Book ${slot.title}?\n\nDeposit: ₱50 (paid now)\nRemaining: ₱${slot.price - 50} (pay on arrival)\n\nYou'll receive contact details after booking.`)) {
        // Add booking to private bookings section
        addPrivateBooking(slot);
        
        alert(`Booking confirmed!\n\n${slot.title} is now reserved.\nDeposit charged: ₱50\n\nOwner: ${slot.owner}\nContact: ${slot.contact}\n\nCheck "My Private Bookings" for details.`);
    }
}

function addPrivateBooking(slot) {
    const privateBookings = document.getElementById('privateBookings');
    
    // Remove empty state if it exists
    const emptyState = privateBookings.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create booking item
    const bookingItem = document.createElement('div');
    bookingItem.className = 'private-booking-item';
    bookingItem.setAttribute('data-slot-id', slot.id);
    
    bookingItem.innerHTML = `
        <div class="booking-header">
            <div class="booking-info">
                <div class="booking-title">${slot.title}</div>
                <div class="booking-location">${slot.distance}</div>
                <div class="booking-time">Today, 9:00 AM - 5:00 PM</div>
            </div>
            <div class="booking-status">
                <span class="status-badge confirmed">Confirmed</span>
            </div>
        </div>
        <div class="booking-details">
            <div class="detail-item">
                <span>Total Cost:</span>
                <span>₱${slot.price}</span>
            </div>
            <div class="detail-item">
                <span>Deposit Paid:</span>
                <span>₱50</span>
            </div>
            <div class="detail-item">
                <span>Remaining:</span>
                <span>₱${slot.price - 50}</span>
            </div>
            <div class="detail-item">
                <span>Owner:</span>
                <span>${slot.owner}</span>
            </div>
            <div class="detail-item">
                <span>Contact:</span>
                <span>${slot.contact}</span>
            </div>
        </div>
        <div class="booking-actions">
            <button class="contact-btn" onclick="contactOwner('${slot.id}')">
                Contact Owner
            </button>
            <button class="cancel-booking-btn" onclick="cancelPrivateBooking('${slot.id}')">
                Cancel Booking
            </button>
        </div>
    `;
    
    privateBookings.appendChild(bookingItem);
}

function contactOwner(slotId) {
    const university = universityData[currentUniversity];
    const slot = university.privateSlots.find(s => s.id === slotId);
    
    if (slot) {
        alert(`Contact Details:\n\nOwner: ${slot.owner}\nPhone: ${slot.contact}\n\n(In a real app, this would open your phone's dialer or messaging app)`);
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

// Handle modal clicks outside content
document.addEventListener('click', function(event) {
    const modal = document.getElementById('universityModal');
    if (event.target === modal) {
        hideUniversityModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideUniversityModal();
    }
});