// EGI Taft Parking live slot updates
const egiMaxSlots = 100;
let egiSlots = 4;
const egiSpan = document.getElementById("egi-availability");

function updateEGISlots() {
    const change = Math.random() < 0.5 ? -1 : 1;
    const newSlots = egiSlots + change;

    if (newSlots >= 0 && newSlots <= egiMaxSlots) {
        egiSlots = newSlots;
        if (egiSpan) {
            egiSpan.textContent = `${egiSlots} slots`;
        }
    }
    const nextInterval = Math.random() * 9000 + 1000;
    setTimeout(updateEGISlots, nextInterval);
}

// One Archer's Place live slot updates
const oapMaxSlots = 50;
let oapSlots = 14;
const oapSpan = document.getElementById("oap-availability");

function updateOAPSlots() {
    const change = Math.random() < 0.5 ? -1 : 1;
    const newSlots = oapSlots + change;

    if (newSlots >= 0 && newSlots <= oapMaxSlots) {
        oapSlots = newSlots;
        if (oapSpan) {
            oapSpan.textContent = `${oapSlots} slots`;
        }
    }
    const nextInterval = Math.random() * 9000 + 1000;
    setTimeout(updateOAPSlots, nextInterval);
}

// Initialize slot updates when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start EGI Taft updates
    setTimeout(updateEGISlots, Math.random() * 9000 + 1000);
    
    // Start One Archer's Place updates
    setTimeout(updateOAPSlots, Math.random() * 9000 + 1000);
});