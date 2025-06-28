// API Client for ParkEase Frontend
// Add this to your existing frontend to connect with the backend

class ParkEaseAPI {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('parkease_token');
    this.ws = null;
    this.initWebSocket();
  }

  // Initialize WebSocket connection for real-time updates
  initWebSocket() {
    try {
      this.ws = new WebSocket('ws://localhost:8080');
      
      this.ws.onopen = () => {
        console.log('Connected to ParkEase WebSocket');
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Reconnect after 5 seconds
        setTimeout(() => this.initWebSocket(), 5000);
      };
    } catch (error) {
      console.log('WebSocket not available, continuing without real-time updates');
    }
  }

  // Handle real-time updates
  handleRealtimeUpdate(data) {
    if (data.type === 'slot_update') {
      // Update slot count in UI
      const slotElement = document.querySelector(`[data-parking-id="${data.parkingAreaId}"] .slots-available`);
      if (slotElement) {
        slotElement.textContent = `${data.availableSlots} slots`;
        
        // Update CSS class based on availability
        slotElement.className = 'slots-available';
        if (data.availableSlots <= 3) {
          slotElement.classList.add('slots-limited');
        } else if (data.availableSlots === 0) {
          slotElement.classList.add('slots-full');
        }
      }
    }
  }

  // Helper method for API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('parkease_token', this.token);
    }
    
    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('parkease_token', this.token);
    }
    
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('parkease_token');
    if (this.ws) {
      this.ws.close();
    }
  }

  // Parking area methods
  async getParkingAreas() {
    return this.request('/parking-areas');
  }

  async getParkingArea(id) {
    return this.request(`/parking-areas/${id}`);
  }

  async createParkingArea(areaData) {
    return this.request('/parking-areas', {
      method: 'POST',
      body: JSON.stringify(areaData),
    });
  }

  // Reservation methods
  async getReservations() {
    return this.request('/reservations');
  }

  async createReservation(parkingAreaId, downpayment = 50) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify({ parkingAreaId, downpayment }),
    });
  }

  async updateReservation(id, updates) {
    return this.request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Owner methods
  async getOwnerReservations() {
    return this.request('/owner/reservations');
  }

  async processEntry(entryData) {
    return this.request('/owner/entry', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async processExit(exitData) {
    return this.request('/owner/exit', {
      method: 'POST',
      body: JSON.stringify(exitData),
    });
  }
}

// Initialize API client
const api = new ParkEaseAPI();

// Example usage functions to integrate with your existing code:

// Replace your existing login function
async function handleLogin(email, password) {
  try {
    const response = await api.login(email, password);
    
    // Route based on user type (keep your existing routing logic)
    if (response.user.userType === 'driver') {
      window.location.href = 'home.html';
    } else if (response.user.userType === 'owner') {
      window.location.href = 'owner-dashboard.html';
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

// Replace your existing registration function
async function handleRegister(userData) {
  try {
    const response = await api.register(userData);
    
    // Route based on user type
    if (response.user.userType === 'driver') {
      window.location.href = 'home.html';
    } else if (response.user.userType === 'owner') {
      window.location.href = 'owner-dashboard.html';
    }
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
}

// Load parking areas (replace your static data)
async function loadParkingAreas() {
  try {
    const areas = await api.getParkingAreas();
    // Update your UI with real data
    updateParkingList(areas);
  } catch (error) {
    console.error('Failed to load parking areas:', error);
    // Fall back to your existing static data
  }
}

// Create reservation (replace your existing reservation logic)
async function createReservation(parkingAreaId) {
  try {
    const reservation = await api.createReservation(parkingAreaId, 50);
    alert(`Reservation created! QR Code: ${reservation.qrCode}`);
    // Update UI to show reservation
  } catch (error) {
    alert('Reservation failed: ' + error.message);
  }
}

// Make API client available globally
window.ParkEaseAPI = api;