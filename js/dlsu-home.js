// DLSU Campus - Live parking slot updates

// Parking slot data for DLSU
const dlsuParkingSlots = {
    'egi-availability': { min: 1, max: 8, current: 4 },
    'oap-availability': { min: 5, max: 25, current: 14 },
    'street-availability': { min: 0, max: 6, current: 2 }
};

function updateDLSUSlots() {
    Object.keys(dlsuParkingSlots).forEach(slotId => {
        const slotData = dlsuParkingSlots[slotId];
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
                } else if (newSlots <= 3) {
                    element.classList.add('slots-limited');
                }
            }
        }
    });
}

// Initialize DLSU page
document.addEventListener('DOMContentLoaded', function() {
    // Start live updates every 7 seconds
    setInterval(updateDLSUSlots, 7000);
    
    // Mark DLSU as selected university
    localStorage.setItem('selectedUniversity', 'dlsu');
});