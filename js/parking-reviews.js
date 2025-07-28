// P

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    
    displayedReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsList.appendChild(reviewElement);
    });
}

function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    reviewDiv.setAttribute('data-type', review.type);
    
    // Create stars
    const stars = Array.from({length: 5}, (_, i) => 
        `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
    ).join('');
    
    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-name">${review.reviewerName}</div>
                <div class="reviewer-meta">${review.reviewerMeta}</div>
            </div>
            <div class="review-rating">
                <div class="review-stars">${stars}</div>
                <div class="review-date">${review.date}</div>
            </div>
        </div>
        <div class="review-content">
            <div class="review-title">${review.title}</div>
            <div class="review-text">${review.text}</div>
        </div>
        <div class="review-actions">
            <div class="review-helpful">
                <button class="helpful-btn ${review.isHelpful ? 'active' : ''}" onclick="toggleHelpful(${review.id})">
                    👍 Helpful (${review.helpful})
                </button>
            </div>
            <a href="#" class="review-report" onclick="reportReview(${review.id})">Report</a>
        </div>
    `;
    
    return reviewDiv;
}

function filterReviews(filterType) {
    currentFilter = filterType;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter reviews by star rating
    let filteredReviews = showingAll ? [...sampleReviews, ...additionalReviews] : [...sampleReviews];
    
    if (filterType !== 'all') {
        const targetRating = parseInt(filterType);
        filteredReviews = filteredReviews.filter(review => review.rating === targetRating);
    }
    
    displayedReviews = filteredReviews;
    loadReviews();
    
    // Update view all button text
    updateViewAllButton();
}

function viewAllReviews() {
    if (!showingAll) {
        // Show all reviews
        showingAll = true;
        displayedReviews = [...sampleReviews, ...additionalReviews];
        
        // Apply current filter if any
        if (currentFilter !== 'all') {
            const targetRating = parseInt(currentFilter);
            displayedReviews = displayedReviews.filter(review => review.rating === targetRating);
        }
        
        loadReviews();
        updateViewAllButton();
    } else {
        // Show only first 3
        showingAll = false;
        displayedReviews = [...sampleReviews];
        
        // Apply current filter if any
        if (currentFilter !== 'all') {
            const targetRating = parseInt(currentFilter);
            displayedReviews = displayedReviews.filter(review => review.rating === targetRating);
        }
        
        loadReviews();
        updateViewAllButton();
    }
}

function updateViewAllButton() {
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (showingAll) {
        viewAllBtn.textContent = 'Show Less';
    } else {
        const totalCount = sampleReviews.length + additionalReviews.length;
        viewAllBtn.textContent = `View All ${totalCount} Reviews`;
    }
}

function toggleHelpful(reviewId) {
    const review = displayedReviews.find(r => r.id === reviewId);
    if (review) {
        if (review.isHelpful) {
            review.helpful--;
            review.isHelpful = false;
        } else {
            review.helpful++;
            review.isHelpful = true;
        }
        loadReviews();
    }
}

function reportReview(reviewId) {
    alert('Review reported. Thank you for helping keep our community safe.');
}

// Write Review Modal Functions
function showWriteReviewModal() {
    document.getElementById('writeReviewModal').style.display = 'flex';
}

function hideWriteReviewModal() {
    document.getElementById('writeReviewModal').style.display = 'none';
    resetReviewForm();
}

function setupReviewForm() {
    // Star rating functionality
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => setRating(index + 1));
        star.addEventListener('mouseenter', () => highlightStars(index + 1));
    });
    
    document.getElementById('starRating').addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });
    
    // Character counter
    const reviewText = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    reviewText.addEventListener('input', () => {
        charCount.textContent = reviewText.value.length;
        validateForm();
    });
    
    // Form validation
    document.getElementById('reviewTitle').addEventListener('input', validateForm);
}

function setRating(rating) {
    selectedRating = rating;
    highlightStars(rating);
    updateRatingLabel(rating);
    validateForm();
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateRatingLabel(rating) {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    document.getElementById('ratingLabel').textContent = labels[rating] || 'Tap to rate';
}

function validateForm() {
    const title = document.getElementById('reviewTitle').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const submitBtn = document.getElementById('submitReviewBtn');
    
    const isValid = selectedRating > 0 && title.length > 0 && text.length > 10;
    submitBtn.disabled = !isValid;
}

function submitReview() {
    const title = document.getElementById('reviewTitle').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    
    if (selectedRating === 0 || !title || text.length < 10) {
        alert('Please complete all required fields.');
        return;
    }
    
    // Create new review object
    const newReview = {
        id: Date.now(),
        reviewerName: "You",
        reviewerMeta: "DLSU Student • Recent Parker",
        rating: selectedRating,
        title: title,
        text: text,
        date: "Just now",
        helpful: 0,
        isHelpful: false,
        type: selectedRating >= 4 ? 'positive' : selectedRating >= 3 ? 'neutral' : 'critical'
    };
    
    // Add to beginning of reviews list
    sampleReviews.unshift(newReview);
    
    // Update displayed reviews based on current view
    if (showingAll) {
        displayedReviews = [...sampleReviews, ...additionalReviews];
    } else {
        displayedReviews = [...sampleReviews].slice(0, 3);
    }
    
    // Apply current filter if any
    if (currentFilter !== 'all') {
        const targetRating = parseInt(currentFilter);
        displayedReviews = displayedReviews.filter(review => review.rating === targetRating);
    }
    
    // Reload reviews
    loadReviews();
    
    // Hide modal and show success
    hideWriteReviewModal();
    alert('Thank you for your review! It has been submitted and will help other parkers.');
    
    // Update overall rating
    updateOverallRating();
    updateViewAllButton();
}

function resetReviewForm() {
    selectedRating = 0;
    
    document.getElementById('reviewTitle').value = '';
    document.getElementById('reviewText').value = '';
    document.getElementById('charCount').textContent = '0';
    
    document.querySelectorAll('.star-input').forEach(star => {
        star.classList.remove('active');
    });
    
    document.getElementById('ratingLabel').textContent = 'Tap to rate';
    document.getElementById('submitReviewBtn').disabled = true;
}

function updateOverallRating() {
    // Recalculate overall rating based on all reviews
    const allReviews = [...sampleReviews, ...additionalReviews];
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = (totalRating / allReviews.length).toFixed(1);
    
    document.querySelector('.rating-score').textContent = avgRating;
    document.querySelector('.rating-count').textContent = `Based on ${allReviews.length} reviews`;
}

// Handle modal clicks
document.addEventListener('click', function(event) {
    const modal = document.getElementById('writeReviewModal');
    if (event.target === modal) {
        hideWriteReviewModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideWriteReviewModal();
    }
});// Parking Reviews System - EGI Taft Parking

// Parking Reviews System - EGI Taft Parking

// Sample reviews data (mechanical turk)
const sampleReviews = [
    {
        id: 1,
        reviewerName: "Maria S.",
        reviewerMeta: "DLSU Student • Regular Parker",
        rating: 5,
        title: "Perfect location for DLSU students!",
        text: "Super convenient location just a 3-minute walk to campus. The security is great and it's covered parking so no worries about rain. A bit pricey but worth it for the convenience.",
        aspects: ["convenience", "security"],
        date: "2 days ago",
        helpful: 12,
        isHelpful: false,
        type: "positive"
    },
    {
        id: 2,
        reviewerName: "Juan D.",
        reviewerMeta: "Faculty Member • Weekly Parker",
        rating: 4,
        title: "Good security but can get full quickly",
        text: "I park here regularly and the security guards are very attentive. The only downside is that it fills up fast during peak hours. Would recommend reserving ahead.",
        aspects: ["security", "availability"],
        date: "5 days ago",
        helpful: 8,
        isHelpful: false,
        type: "positive"
    },
    {
        id: 3,
        reviewerName: "Anna R.",
        reviewerMeta: "DLSU Student • Occasional Parker",
        rating: 3,
        title: "Convenient but expensive",
        text: "The location is unbeatable - so close to DLSU. However, the hourly rates add up quickly if you're staying for a full day. Good for short visits.",
        aspects: ["convenience", "pricing"],
        date: "1 week ago",
        helpful: 15,
        isHelpful: true,
        type: "neutral"
    },
    {
        id: 4,
        reviewerName: "Carlos M.",
        reviewerMeta: "Visitor • First-time Parker",
        rating: 5,
        title: "Smooth experience from start to finish",
        text: "Used the reservation system and everything went perfectly. Guard was helpful in directing me to my spot. Clean facility and well-lit. Will definitely use again.",
        aspects: ["convenience", "staff", "cleanliness"],
        date: "1 week ago",
        helpful: 6,
        isHelpful: false,
        type: "positive"
    },
    {
        id: 5,
        reviewerName: "Lisa T.",
        reviewerMeta: "DLSU Student • Monthly Parker",
        rating: 4,
        title: "Great for daily parking",
        text: "I park here almost every day for classes. The monthly rate is reasonable and I always find a spot with my reservation. Elevator makes it easy to access different levels.",
        aspects: ["convenience", "pricing", "availability"],
        date: "2 weeks ago",
        helpful: 9,
        isHelpful: false,
        type: "positive"
    },
    {
        id: 6,
        reviewerName: "Mark L.",
        reviewerMeta: "DLSU Alumni • Occasional Parker",
        rating: 2,
        title: "Overpriced for what you get",
        text: "While the location is convenient, I think ₱25/hour is too steep. There are cheaper alternatives nearby if you don't mind walking a bit more.",
        aspects: ["pricing"],
        date: "3 weeks ago",
        helpful: 4,
        isHelpful: false,
        type: "critical"
    },
    {
        id: 7,
        reviewerName: "Sarah K.",
        reviewerMeta: "DLSU Student • Regular Parker",
        rating: 5,
        title: "Best parking near DLSU",
        text: "I've tried different parking areas around DLSU and this is by far the best. Clean, secure, and the staff is always helpful. The reservation system works perfectly.",
        aspects: ["security", "staff", "cleanliness"],
        date: "3 weeks ago",
        helpful: 11,
        isHelpful: false,
        type: "positive"
    },
    {
        id: 8,
        reviewerName: "Rico P.",
        reviewerMeta: "Visitor • Occasional Parker",
        rating: 4,
        title: "Good for visitors",
        text: "Easy to find and park. Payment process is straightforward. Only issue is sometimes it's full during exam season.",
        aspects: ["convenience", "availability"],
        date: "1 month ago",
        helpful: 3,
        isHelpful: false,
        type: "positive"
    }
];

// Additional reviews for loading more
const additionalReviews = [
    {
        id: 9,
        reviewerName: "Jenny L.",
        reviewerMeta: "DLSU Faculty • Daily Parker",
        rating: 4,
        title: "Reliable and safe",
        text: "I've been parking here for over a year. Very reliable and I always feel safe leaving my car here. The only improvement would be better ventilation on lower levels.",
        aspects: ["security", "availability"],
        date: "1 month ago",
        helpful: 7,
        isHelpful: false,
        type: "positive"
    },
    {
        id: 10,
        reviewerName: "Mike R.",
        reviewerMeta: "DLSU Student • Weekend Parker",
        rating: 3,
        title: "Decent but pricey",
        text: "Does the job but the pricing could be more student-friendly. Good location though and never had any issues with security.",
        aspects: ["pricing", "security"],
        date: "1 month ago",
        helpful: 5,
        isHelpful: false,
        type: "neutral"
    }
];

// Current state
let currentFilter = 'all';
let displayedReviews = [...sampleReviews];
let selectedRating = 0;
let selectedAspects = [];

// Initialize reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    setupReviewForm();
});

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    
    displayedReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsList.appendChild(reviewElement);
    });
}

function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    reviewDiv.setAttribute('data-type', review.type);
    
    // Create stars
    const stars = Array.from({length: 5}, (_, i) => 
        `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
    ).join('');
    
    // Create aspects
    const aspects = review.aspects.map(aspect => 
        `<span class="review-aspect">${capitalizeFirst(aspect)}</span>`
    ).join('');
    
    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-name">${review.reviewerName}</div>
                <div class="reviewer-meta">${review.reviewerMeta}</div>
            </div>
            <div class="review-rating">
                <div class="review-stars">${stars}</div>
                <div class="review-date">${review.date}</div>
            </div>
        </div>
        <div class="review-content">
            <div class="review-title">${review.title}</div>
            <div class="review-text">${review.text}</div>
        </div>
        ${aspects ? `<div class="review-aspects">${aspects}</div>` : ''}
        <div class="review-actions">
            <div class="review-helpful">
                <button class="helpful-btn ${review.isHelpful ? 'active' : ''}" onclick="toggleHelpful(${review.id})">
                    👍 Helpful (${review.helpful})
                </button>
            </div>
            <a href="#" class="review-report" onclick="reportReview(${review.id})">Report</a>
        </div>
    `;
    
    return reviewDiv;
}

function filterReviews(filterType) {
    currentFilter = filterType;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter reviews
    let filteredReviews = [...sampleReviews];
    
    switch(filterType) {
        case 'recent':
            filteredReviews = filteredReviews.filter(review => 
                review.date.includes('day') || review.date.includes('week')
            );
            break;
        case 'positive':
            filteredReviews = filteredReviews.filter(review => 
                review.rating >= 4
            );
            break;
        case 'critical':
            filteredReviews = filteredReviews.filter(review => 
                review.rating <= 3
            );
            break;
        default:
            // Show all
            break;
    }
    
    displayedReviews = filteredReviews;
    loadReviews();
}

function loadMoreReviews() {
    // Add additional reviews to displayed list
    const newReviews = additionalReviews.filter(review => 
        !displayedReviews.find(existing => existing.id === review.id)
    );
    
    if (newReviews.length > 0) {
        displayedReviews = [...displayedReviews, ...newReviews];
        loadReviews();
        
        // If no more reviews, hide the button
        if (newReviews.length < additionalReviews.length) {
            document.querySelector('.load-more-btn').style.display = 'none';
        }
    } else {
        document.querySelector('.load-more-btn').textContent = 'No more reviews';
        document.querySelector('.load-more-btn').disabled = true;
    }
}

function toggleHelpful(reviewId) {
    const review = displayedReviews.find(r => r.id === reviewId);
    if (review) {
        if (review.isHelpful) {
            review.helpful--;
            review.isHelpful = false;
        } else {
            review.helpful++;
            review.isHelpful = true;
        }
        loadReviews();
    }
}

function reportReview(reviewId) {
    alert('Review reported. Thank you for helping keep our community safe.');
}

// Write Review Modal Functions
function showWriteReviewModal() {
    document.getElementById('writeReviewModal').style.display = 'flex';
}

function hideWriteReviewModal() {
    document.getElementById('writeReviewModal').style.display = 'none';
    resetReviewForm();
}

function setupReviewForm() {
    // Star rating functionality
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => setRating(index + 1));
        star.addEventListener('mouseenter', () => highlightStars(index + 1));
    });
    
    document.getElementById('starRating').addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });
    
    // Character counter
    const reviewText = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    reviewText.addEventListener('input', () => {
        charCount.textContent = reviewText.value.length;
        validateForm();
    });
    
    // Form validation
    document.getElementById('reviewTitle').addEventListener('input', validateForm);
}

function setRating(rating) {
    selectedRating = rating;
    highlightStars(rating);
    updateRatingLabel(rating);
    validateForm();
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-input');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateRatingLabel(rating) {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    document.getElementById('ratingLabel').textContent = labels[rating] || 'Tap to rate';
}

function toggleAspect(element) {
    const aspect = element.getAttribute('data-aspect');
    element.classList.toggle('selected');
    
    if (selectedAspects.includes(aspect)) {
        selectedAspects = selectedAspects.filter(a => a !== aspect);
    } else {
        selectedAspects.push(aspect);
    }
}

function validateForm() {
    const title = document.getElementById('reviewTitle').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const submitBtn = document.getElementById('submitReviewBtn');
    
    const isValid = selectedRating > 0 && title.length > 0 && text.length > 10;
    submitBtn.disabled = !isValid;
}

function submitReview() {
    const title = document.getElementById('reviewTitle').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    
    if (selectedRating === 0 || !title || text.length < 10) {
        alert('Please complete all required fields.');
        return;
    }
    
    // Create new review object
    const newReview = {
        id: Date.now(),
        reviewerName: "You",
        reviewerMeta: "DLSU Student • Recent Parker",
        rating: selectedRating,
        title: title,
        text: text,
        aspects: selectedAspects,
        date: "Just now",
        helpful: 0,
        isHelpful: false,
        type: selectedRating >= 4 ? 'positive' : selectedRating >= 3 ? 'neutral' : 'critical'
    };
    
    // Add to beginning of reviews list
    displayedReviews.unshift(newReview);
    sampleReviews.unshift(newReview);
    
    // Reload reviews
    loadReviews();
    
    // Hide modal and show success
    hideWriteReviewModal();
    alert('Thank you for your review! It has been submitted and will help other parkers.');
    
    // Update overall rating (simple calculation)
    updateOverallRating();
}

function resetReviewForm() {
    selectedRating = 0;
    selectedAspects = [];
    
    document.getElementById('reviewTitle').value = '';
    document.getElementById('reviewText').value = '';
    document.getElementById('charCount').textContent = '0';
    
    document.querySelectorAll('.star-input').forEach(star => {
        star.classList.remove('active');
    });
    
    document.querySelectorAll('.aspect-tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    
    document.getElementById('ratingLabel').textContent = 'Tap to rate';
    document.getElementById('submitReviewBtn').disabled = true;
}

function updateOverallRating() {
    // Recalculate overall rating based on all reviews
    const totalRating = sampleReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = (totalRating / sampleReviews.length).toFixed(1);
    
    document.querySelector('.rating-score').textContent = avgRating;
    document.querySelector('.rating-count').textContent = `Based on ${sampleReviews.length} reviews`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle modal clicks
document.addEventListener('click', function(event) {
    const modal = document.getElementById('writeReviewModal');
    if (event.target === modal) {
        hideWriteReviewModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideWriteReviewModal();
    }
});