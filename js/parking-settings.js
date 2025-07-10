// Default settings
const defaultSettings = {
    initialRate: 30,
    hourlyRate: 25,
    downpayment: 50,
    gracePeriod: 15,
    operatingHours: '24/7',
    overnightRate: 100
};

function loadSettings() {
    // Load saved settings from localStorage or use defaults
    const settings = JSON.parse(localStorage.getItem('parkingSettings')) || defaultSettings;

    // Update form inputs
    document.getElementById('initialRateInput').value = settings.initialRate;
    document.getElementById('hourlyRateInput').value = settings.hourlyRate;
    document.getElementById('downpaymentInput').value = settings.downpayment;
    document.getElementById('gracePeriodInput').value = settings.gracePeriod;
    document.getElementById('operatingHoursInput').value = settings.operatingHours;
    document.getElementById('overnightRateInput').value = settings.overnightRate;

    // Update current settings display
    updateCurrentSettingsDisplay(settings);
    updatePricingPreview(settings);
}

function updateCurrentSettingsDisplay(settings) {
    document.getElementById('currentInitialRate').textContent = `₱${settings.initialRate}`;
    document.getElementById('currentHourlyRate').textContent = `₱${settings.hourlyRate}/hr`;
    document.getElementById('currentDownpayment').textContent = `₱${settings.downpayment}`;
}

function updatePricingPreview(settings) {
    // Calculate pricing examples
    const price1h = settings.initialRate;
    const price2h = settings.initialRate + settings.hourlyRate;
    const price3h = settings.initialRate + (settings.hourlyRate * 2);
    const price4h = settings.initialRate + (settings.hourlyRate * 3);

    document.getElementById('price1h').textContent = `₱${price1h}`;
    document.getElementById('price2h').textContent = `₱${price2h}`;
    document.getElementById('price3h').textContent = `₱${price3h}`;
    document.getElementById('price4h').textContent = `₱${price4h}`;

    // Update reservation preview
    document.getElementById('previewDownpayment').textContent = settings.downpayment;
    const remaining = Math.max(0, price2h - settings.downpayment);
    document.getElementById('previewRemaining').textContent = remaining;
}

function saveSettings() {
    const settings = {
        initialRate: parseInt(document.getElementById('initialRateInput').value),
        hourlyRate: parseInt(document.getElementById('hourlyRateInput').value),
        downpayment: parseInt(document.getElementById('downpaymentInput').value),
        gracePeriod: parseInt(document.getElementById('gracePeriodInput').value),
        operatingHours: document.getElementById('operatingHoursInput').value,
        overnightRate: parseInt(document.getElementById('overnightRateInput').value)
    };

    // Validation
    if (settings.initialRate < 1 || settings.hourlyRate < 1 || settings.downpayment < 10) {
        alert('Please check your inputs:\n\n• Initial rate must be at least ₱1\n• Hourly rate must be at least ₱1\n• Downpayment must be at least ₱10');
        return;
    }

    // Save to localStorage
    localStorage.setItem('parkingSettings', JSON.stringify(settings));

    // Update displays
    updateCurrentSettingsDisplay(settings);
    updatePricingPreview(settings);

    // Show confirmation
    alert(`Settings saved successfully!\n\nInitial Rate: ₱${settings.initialRate}\nHourly Rate: ₱${settings.hourlyRate}/hr\nDownpayment: ₱${settings.downpayment}\n\nChanges will apply to new parking sessions.`);
}

function resetToDefaults() {
    if (confirm('Reset all settings to default values?')) {
        // Clear localStorage
        localStorage.removeItem('parkingSettings');
        
        // Reload with defaults
        loadSettings();
        
        alert('Settings reset to defaults!');
    }
}

// Real-time preview updates
function setupRealTimePreview() {
    const inputs = ['initialRateInput', 'hourlyRateInput', 'downpaymentInput'];
    
    inputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', function() {
            const tempSettings = {
                initialRate: parseInt(document.getElementById('initialRateInput').value) || 0,
                hourlyRate: parseInt(document.getElementById('hourlyRateInput').value) || 0,
                downpayment: parseInt(document.getElementById('downpaymentInput').value) || 0
            };
            
            if (tempSettings.initialRate > 0 && tempSettings.hourlyRate > 0) {
                updatePricingPreview(tempSettings);
            }
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupRealTimePreview();
});