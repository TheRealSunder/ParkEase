// Private Slot Details Page JavaScript

// Sample slot data (mechanical turk)
const slotData = {
    'one-archers-a15': {
        name: 'One Archer\'s Place - Tower A',
        distance: '0.3 km from DLSU • 5 min walk',
        details: 'Level 2, Slot 15 • Covered parking',
        price: 200,
        rating: 4.8,
        reviews: 12,
        owner: {
            name: 'Maria Santos',
            avatar: 'MS',
            phone: '0917-123-4567',
            rating: 4.9,
            experience: '2 years hosting',
            responseTime: '1 hour'
        },
        address: 'One Archer\'s Place, Taft Avenue, Manila',
        directions: 'Walk south on Taft Ave from DLSU main gate for 300m. Building is on the right side.',
        image: 'images/owner_1.png',
        features: ['Covered Parking', 'Secure Building', 'Easy Access', 'CCTV Monitored'],
        reviewsList: [
            {
                reviewer: 'Juan D.',
                date: '2 weeks ago',
                rating: 5,
                text: 'Perfect spot for DLSU students! Very close to campus and the owner is very responsive.'
            },
            {
                reviewer: 'Anna R.',
                date: '1 month ago',
                rating: 4,
                text: 'Good location and secure parking. Easy to find and the building has good security.'
            },
            {
                reviewer: 'Carlos M.',
                date: '2 months ago',
                rating: 5,
                text: 'Highly recommend! Close to campus, covered parking, and Maria is very accommodating.'
            }
        ]
    },
    'the-residences-b8': {
        name: 'The Residences - Building B',
        distance: '0.5 km from DLSU • 7 min walk',
        details: 'Ground floor, Slot 8 • Easy access',
        price: 150,
        rating: 4.5,
        reviews: 8,
        owner: {
            name: 'Juan Cruz',
            avatar: 'JC',
            phone: '0926-876-5432',
            rating: 4.7,
            experience: '1 year hosting',
            responseTime: '2 hours'
        },
        address: 'The Residences Building B, Malate, Manila',
        directions: 'Exit DLSU main gate, walk south on Taft Ave, turn right on Pedro Gil St. Building is 2 blocks down.',
        image: 'images/owner_2.png',
        features: ['Ground Level', 'Easy Access', 'Secure Building', '24/7 Guard'],
        reviewsList: [
            {
                reviewer: 'Lisa T.',
                date: '1 week ago',
                rating: 5,
                text: 'Great ground floor spot, very easy to park. Juan is helpful and quick to respond.'
            },
            {
                reviewer: 'Mark L.',
                date: '3 weeks ago',
                rating: 4,
                text: 'Good value for money. A bit of a walk but the ground floor access is convenient.'
            }
        ]
    },
    'malate-towers-23': {
        name: 'Malate Towers - Unit 15A',
        distance: '0.7 km from DLSU • 9 min walk',
        details: 'Basement 1, Slot 23 • Secure parking',
        price: 120,
        rating: 5.0,
        reviews: 3,
        owner: {
            name: 'Anna Reyes',
            avatar: 'AR',
            phone: '0915-555-7890',
            rating: 5.0,
            experience: '6 months hosting',
            responseTime: '30 minutes'
        },
        address: 'Malate Towers Unit 15A, M. Adriatico St, Manila',
        directions: 'From DLSU, walk to Leon Guinto St, then head to M. Adriatico St. Building is on the corner.',
        image: 'images/owner_3.png',
        features: ['Basement Parking', 'Very Secure', 'Affordable Rate', 'Quiet Area'],
        reviewsList: [
            {
                reviewer: 'Rico P.',
                date: '2 weeks ago',
                rating: 5,
                text: 'Best value near DLSU! Anna is super responsive and the parking is very secure.'
            },
            {
                reviewer: 'Jenny L.',
                date: '1 month ago',
                rating: 5,
                text: 'Excellent spot for the price. Safe area and Anna is very accommodating.'
            }
        ]
    }
};

// Current slot ID
let currentSlotId = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get slot ID from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    currentSlotId = urlParams.get('slot') || localStorage.getItem('currentSlotId') || 'one-archers-a15';
    
    loadSlotDetails();
    
    // Set default booking date to today
    document.getElementById('bookingDate').value = new Date().toISOString().split('T')[0];
    
    // Add event listeners for booking form
    setupBookingForm();
});

function loadSlotDetails() {
    const slot = slotData[currentSlotId];
    if (!slot) {
        console.error('Slot not found:', currentSlotId);
        return;
    }
    
    // Update header
    document.getElementById('slotTitle').textContent = slot.name;
    document.getElementById('slotLocation').textContent = slot.distance;
    
    // Update slot image
    document.getElementById('slotImage').src = slot.image;
    
    // Update overview section
    document.getElementById('slotName').textContent = slot.name;
    document.getElementById('slotDistance').textContent = slot.distance;
    document.getElementById('slotDetails').textContent = slot.details;
    document.getElementById('priceAmount').textContent = `₱${slot.price}`;
    
    // Update rating
    updateRatingDisplay(slot.rating, slot.reviews);
    
    // Update owner information
    updateOwnerInfo(slot.owner);
    
    // Update features
    updateFeatures(slot.features);
    
    // Update location
    document.getElementById('locationAddress').textContent = slot.address;
    document.getElementById('locationDirections').textContent = slot.directions;
    
    // Update reviews
    updateReviews(slot.reviewsList, slot.reviews);
    
    // Update booking section
    updateBookingSummary(slot.price);
}

function updateRatingDisplay(rating, reviewCount) {
    const starsContainer = document.getElementById('ratingStars');
    const ratingText = document.getElementById('ratingText');
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Add stars
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = i <= rating ? 'star filled' : 'star';
        star.textContent = '★';
        starsContainer.appendChild(star);
    }
    
    ratingText.textContent = `${rating} (${reviewCount} reviews)`;
}

function updateOwnerInfo(owner) {
    document.getElementById('ownerAvatar').textContent = owner.avatar;
    document.getElementById('ownerName').textContent = owner.name;
    document.getElementById('ownerPhone').textContent = owner.phone;
    
    // Update owner meta info
    const ownerRating = document.querySelector('.owner-rating');
    const ownerExperience = document.querySelector('.owner-experience');
    const ownerResponse = document.querySelector('.owner-response');
    
    ownerRating.textContent = `⭐ ${owner.rating} Owner Rating`;
    ownerExperience.textContent = `${owner.experience}`;
    ownerResponse.textContent = `Usually responds within ${owner.responseTime}`;
}

function updateFeatures(features) {
    const featuresGrid = document.getElementById('featuresGrid');
    featuresGrid.innerHTML = '';
    
    const featureIcons = {
        'Covered Parking': '🏢',
        'Secure Building': '🔒',
        'Easy Access': '🚶',
        'CCTV Monitored': '📹',
        'Ground Level': '🚗',
        '24/7 Guard': '👮',
        'Basement Parking': '🅿️',
        'Very Secure': '🛡️',
        'Affordable Rate': '💰',
        'Quiet Area': '🤫'
    };
    
    features.forEach(feature => {
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item';
        featureItem.innerHTML = `
            <div class="feature-icon">${featureIcons[feature] || '✅'}</div>
            <div class="feature-text">${feature}</div>
        `;
        featuresGrid.appendChild(featureItem);
    });
}

function updateReviews(reviewsList, totalReviews) {
    const reviewsContainer = document.getElementById('reviewsList');
    const reviewsSummary = document.getElementById('reviewsSummary');
    
    reviewsSummary.textContent = `${totalReviews} reviews`;
    reviewsContainer.innerHTML = '';
    
    // Show first 2 reviews
    const reviewsToShow = reviewsList.slice(0, 2);
    
    reviewsToShow.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        // Create stars for review
        const stars = Array.from({length: 5}, (_, i) => 
            `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
        ).join('');
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="reviewer-name">${review.reviewer}</div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">${stars}</div>
            <div class="review-text">${review.text}</div>
        `;
        
        reviewsContainer.appendChild(reviewItem);
    });
}

function setupBookingForm() {
    const durationSelect = document.getElementById('duration');
    const slotRateElement = document.getElementById('slotRate');
    const totalAmountElement = document.getElementById('totalAmount');
    const payOnArrivalElement = document.getElementById('payOnArrival');
    
    durationSelect.addEventListener('change', function() {
        const slot = slotData[currentSlotId];
        updateBookingSummary(slot.price);
    });
}

function updateBookingSummary(hourlyRate) {
    const duration = parseInt(document.getElementById('duration').value);
    const slotCost = Math.round((hourlyRate / 8) * duration); // Assuming base rate is for 8 hours
    const serviceFee = 20;
    const total = slotCost + serviceFee;
    const deposit = 50;
    const payOnArrival = total - deposit;
    
    document.getElementById('slotRate').textContent = `₱${slotCost}`;
    document.getElementById('totalAmount').textContent = `₱${total}`;
    document.getElementById('payOnArrival').textContent = `₱${payOnArrival}`;
}

function contactOwner() {
    document.getElementById('contactModal').style.display = 'flex';
}

function hideContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

function callOwner() {
    const slot = slotData[currentSlotId];
    alert(`Calling ${slot.owner.name} at ${slot.owner.phone}...\n\n(In a real app, this would open your phone's dialer)`);
    hideContactModal();
}

function messageOwner() {
    const slot = slotData[currentSlotId];
    alert(`Opening messages to ${slot.owner.name}...\n\n(In a real app, this would open your messaging app with a pre-filled message)`);
    hideContactModal();
}

function getDirections() {
    const slot = slotData[currentSlotId];
    alert(`Opening directions to ${slot.address}...\n\n(In a real app, this would open Maps with navigation)`);
}

function viewAllReviews() {
    const slot = slotData[currentSlotId];
    alert(`Viewing all ${slot.reviews} reviews for ${slot.name}...\n\n(In a real app, this would show a full reviews page)`);
}

function bookSlot() {
    const slot = slotData[currentSlotId];
    const date = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('startTime').value;
    const duration = document.getElementById('duration').value;
    
    if (!date) {
        alert('Please select a booking date');
        return;
    }
    
    const totalAmount = document.getElementById('totalAmount').textContent;
    const payOnArrival = document.getElementById('payOnArrival').textContent;
    
    if (confirm(`Confirm booking for ${slot.name}?\n\nDate: ${date}\nTime: ${startTime}\nDuration: ${duration} hours\n\nTotal: ${totalAmount}\nPay now: ₱50\nPay on arrival: ${payOnArrival}\n\nOwner will be notified of your booking.`)) {
        
        // Show success message
        alert(`Booking confirmed!\n\n${slot.name} is reserved for you.\n\nDeposit charged: ₱50\nRemaining: ${payOnArrival}\n\nOwner: ${slot.owner.name}\nContact: ${slot.owner.phone}\n\nYou'll receive a confirmation message shortly.`);
        
        // In a real app, this would redirect to a confirmation page or back to bookings
        window.location.href = 'private-parking.html';
    }
}

// Handle modal clicks outside content
document.addEventListener('click', function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        hideContactModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideContactModal();
    }
});

// Function to navigate to this page from private parking listing
function viewSlotDetails(slotId) {
    localStorage.setItem('currentSlotId', slotId);
    window.location.href = `private-slot-details.html?slot=${slotId}`;
}