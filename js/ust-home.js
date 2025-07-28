// UST Campus - Live parking slot updates

// Parking slot data for UST
const ustParkingSlots = {
    'ust-main-availability': { min: 0, max: 8, current: 2 },
    'espana-availability': { min: 3, max: 15, current: 8 },
    'sampaloc-availability': { min: 8, max: 20, current: 12 },
    'noval-availability': { min: 1, max: 8, current: 3 }
};

function updateUSTSlots() {
    Object.keys(ustParkingSlots).forEach(slotId => {
        const slotData = ustParkingSlots[slotId];
        const element = document.getElementById(slotId);
        
        if (element) {
            // Random change: -1, 0, or +1
            const change = Math.random() < 0.5 ? -1 : 1;
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
                } else if (newSlots <= 4) {
                    element.classList.add('slots-limited');
                }
            }
        }
    });
}

// Initialize UST page
document.addEventListener('DOMContentLoaded', function() {
    // Start live updates every 8 seconds
    setInterval(updateUSTSlots, 8000);
    
    // Mark UST as selected university
    localStorage.setItem('selectedUniversity', 'ust');
});