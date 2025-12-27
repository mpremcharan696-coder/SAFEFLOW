// Mock Data Store

const EVENTS = [
    {
        id: 'evt-001',
        name: 'Grand City Music Festival',
        date: '2025-12-25',
        location: 'Central Park Arena',
        totalCapacity: 50000,
        currentAttendance: 12450,
        status: 'Active'
    }
];

const GATES = [
    { id: 'g1', name: 'Gate A (North)', status: 'Open', crowdLevel: 'Low', count: 1200, capacity: 5000 },
    { id: 'g2', name: 'Gate B (East)', status: 'Open', crowdLevel: 'Moderate', count: 3500, capacity: 5000 },
    { id: 'g3', name: 'Gate C (South)', status: 'Congested', crowdLevel: 'Critical', count: 4800, capacity: 5000 },
    { id: 'g4', name: 'Gate D (VIP)', status: 'Open', crowdLevel: 'Low', count: 450, capacity: 1000 }
];

const ZONES = [
    { id: 'z1', name: 'Main Stage', density: 85, status: 'High', staff: 12 },
    { id: 'z2', name: 'Food Court', density: 45, status: 'Moderate', staff: 5 },
    { id: 'z3', name: 'Camping Area', density: 20, status: 'Low', staff: 3 },
    { id: 'z4', name: 'Parking Lot A', density: 60, status: 'Moderate', staff: 4 }
];

const ALERTS = [
    { id: 'a1', type: 'Medical', message: 'Medical emergency at Zone 2', time: '10:45 AM', status: 'Active', location: 'Food Court' },
    { id: 'a2', type: 'Security', message: 'Unauthorized entry attempt at Gate C', time: '11:02 AM', status: 'Resolved', location: 'Gate C' }
];

class Store {
    constructor() {
        this.state = {
            userRole: null, // 'authority' | 'public' | null
            currentEvent: EVENTS[0],
            gates: GATES,
            zones: ZONES,
            alerts: ALERTS
        };
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setRole(role) {
        this.state.userRole = role;
        this.notify();
    }

    addAlert(alert) {
        this.state.alerts.unshift(alert);
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(l => l(this.state));
    }
}

export const store = new Store();
