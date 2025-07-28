// Ateneo Campus - Live parking slot updates

// Parking slot data for Ateneo
const ateneoParkingSlots = {
    'ateneo-court-availability': { min: 2, max: 12, current: 6 },
    'katipunan-availability': { min: 8, max: 25, current: 15 },
    'uptown-availability': { min: 25, max: 60, current: 45 },
    'loyola-availability': { min: 2, max: 10, current: 5 }
};

function updateAteneoSlots() {
    Object.keys(ateneoParkingSlots).forEach(slotId => {
        const slotData = ateneoParkingSlots[slotId];
        const element = document.getElementById(slotId);
        
        if (element) {
            // Random change: -2, -1, 0, +1, +2
            const change = Math.floor(Math.random() * 5) - 2;
            let newSlots = slotData.current + change;
            
            // Keep within bounds
            newSlots = Math.max(slotData.min, Math.min(slotData.max, newSlots));
            
            if (newSlots !== slotData.current) {
                slotData.current = newSlots;
                element.textContent = `${newSlots} slots`;
                
                // Update CSS classes based on availability
                element.className = 'slots-available';
                if (newSlots === 0) {
                    element.classList.add('slots-full');
                } else if (newSlots <= 5) {
                    element.classList.add('slots-limited');
                }
            }
        }
    });
}

// Initialize Ateneo page
document.addEventListener('DOMContentLoaded', function() {
    // Start live updates every 6 seconds
    setInterval(updateAteneoSlots, 6000);
    
    // Mark Ateneo as selected university
    localStorage.setItem('selectedUniversity', 'ateneo');
});