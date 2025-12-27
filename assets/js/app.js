/**
 * SafeFlow - Event Safety Management System
 * Consolidated Application Script for file:// compatibility
 */

/* --- DATA STORE --- */

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

    toggleGateStatus(gateId) {
        const gate = this.state.gates.find(g => g.id === gateId);
        if (gate) {
            gate.status = gate.status === 'Open' ? 'Closed' : 'Open';
            this.notify();
        }
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

const store = new Store();

/* --- MODAL SYSTEM --- */
const Modal = {
    show({ title, message, type = 'info', theme = 'light', onConfirm }) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const content = document.createElement('div');
        content.className = `modal-content ${theme}`;

        let inputHtml = '';
        if (type === 'prompt') {
            inputHtml = `<input type="password" class="input-field" placeholder="Enter code..." id="modal-input" autofocus>`;
        }

        let actionsHtml = '';
        if (type === 'confirm' || type === 'prompt') {
            actionsHtml = `
                <button class="btn btn-outline text-sm" id="modal-cancel">Cancel</button>
                <button class="btn btn-primary text-sm" id="modal-confirm">Confirm</button>
            `;
        } else {
            actionsHtml = `<button class="btn btn-primary text-sm" id="modal-confirm">OK</button>`;
        }

        content.innerHTML = `
            <div class="modal-title">${title}</div>
            <div class="modal-body">${message}</div>
            ${inputHtml}
            <div class="modal-actions">
                ${actionsHtml}
            </div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Focus input if prompt
        if (type === 'prompt') {
            setTimeout(() => content.querySelector('#modal-input').focus(), 100);
        }

        // Event Handlers
        const close = () => {
            overlay.style.animation = 'fadeIn 0.2s reverse forwards';
            setTimeout(() => document.body.removeChild(overlay), 200);
        };

        const confirmBtn = content.querySelector('#modal-confirm');
        const cancelBtn = content.querySelector('#modal-cancel');
        const input = content.querySelector('#modal-input');

        confirmBtn.onclick = () => {
            if (type === 'prompt') {
                if (onConfirm) onConfirm(input.value);
            } else {
                if (onConfirm) onConfirm();
            }
            close();
        };

        if (cancelBtn) {
            cancelBtn.onclick = close;
        }

        if (input) {
            input.onkeyup = (e) => {
                if (e.key === 'Enter') confirmBtn.click();
            };
        }
    }
};


/* --- COMPONENTS & PAGES --- */

// Landing Page
function renderLanding() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center h-full bg-slate-900 text-white p-xl';

    container.innerHTML = `
        <div class="text-center max-w-2xl">
            <h1 class="text-4xl font-bold mb-4 text-blue-500 tracking-tight">SafeFlow</h1>
            <p class="text-xl text-slate-300 mb-12">Next-Generation Event Venue Safety Management System</p>
            
            <div class="grid grid-cols-2 gap-lg w-full">
                <button id="btn-authority" class="card hover:shadow-lg transition-all cursor-pointer bg-navy-800 border border-navy-700 flex flex-col items-center p-xl gap-md group hover:border-blue-500">
                    <i class="fa-solid fa-shield-halved text-5xl text-blue-500 group-hover:scale-110 transition-transform mb-4"></i>
                    <h2 class="text-2xl font-bold">Authority Login</h2>
                    <p class="text-sm text-slate-400">For Police, Security, and Event Admins</p>
                </button>

                <button id="btn-public" class="card hover:shadow-lg transition-all cursor-pointer bg-navy-800 border border-navy-700 flex flex-col items-center p-xl gap-md group hover:border-green-500">
                    <i class="fa-solid fa-users text-5xl text-green-500 group-hover:scale-110 transition-transform mb-4"></i>
                    <h2 class="text-2xl font-bold">Public Portal</h2>
                    <p class="text-sm text-slate-400">For Attendees and Visitors</p>
                </button>
            </div>
        </div>
    `;

    container.querySelector('#btn-authority').addEventListener('click', () => {
        Modal.show({
            title: 'Authority Access',
            message: 'Please enter the secure access code to continue.',
            type: 'prompt',
            theme: 'dark',
            onConfirm: (password) => {
                if (password === '1212') {
                    store.setRole('authority');
                } else {
                    Modal.show({
                        title: 'Access Denied',
                        message: 'The code you entered is incorrect.',
                        type: 'info',
                        theme: 'dark'
                    });
                }
            }
        });
    });

    container.querySelector('#btn-public').addEventListener('click', () => {
        store.setRole('public');
    });

    return container;
}

// Authority Dashboard
function renderAuthorityDashboard() {
    const state = store.getState();
    const container = document.createElement('div');
    container.className = 'auth-view flex flex-col h-full';

    // Header
    const header = document.createElement('header');
    header.className = 'nav-bar shadow';
    header.innerHTML = `
        <div class="flex items-center gap-md">
            <div class="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white text-lg">
                 <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold tracking-tight">SafeFlow Command</h1>
                <p class="text-xs text-slate-400 font-mono uppercase">LIVE MONITORING • ${state.currentEvent.name.toUpperCase()}</p>
            </div>
        </div>
        <div class="flex items-center gap-md">
            <button class="btn btn-danger text-sm flex items-center gap-2 shadow-red-900/50 shadow-lg" id="btn-emergency">
                <i class="fa-solid fa-tower-broadcast animate-pulse"></i> BROADCAST ALERT
            </button>
            <div class="h-8 w-px bg-navy-700 mx-2"></div>
            <div class="flex items-center gap-sm text-sm text-slate-300 bg-navy-800 px-3 py-1 rounded-full border border-navy-700">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                System Online
            </div>
            <button class="btn btn-outline text-xs border-slate-600 text-slate-400 hover:text-white hover:border-white" id="btn-logout">Logout</button>
        </div>
    `;

    // Main Content
    const main = document.createElement('main');
    main.className = 'flex-1 p-lg overflow-y-auto custom-scrollbar';

    // Top Stats Row
    const statsGrid = document.createElement('div');
    statsGrid.className = 'grid grid-cols-4 gap-md mb-lg';

    const stats = [
        { label: 'Total Attendance', value: state.currentEvent.currentAttendance.toLocaleString(), icon: 'fa-users', color: 'text-blue-500', trend: '+12% / hr' },
        { label: 'Venue Capacity', value: `${Math.round(state.currentEvent.currentAttendance / state.currentEvent.totalCapacity * 100)}%`, icon: 'fa-chart-pie', color: 'text-green-500', trend: 'Stable' },
        { label: 'Active Alerts', value: state.alerts.filter(a => a.status === 'Active').length, icon: 'fa-triangle-exclamation', color: 'text-red-500', trend: 'Needs Action' },
        { label: 'Security Staff', value: '42 Active', icon: 'fa-user-shield', color: 'text-amber-500', trend: 'On Patrol' }
    ];

    statsGrid.innerHTML = stats.map(s => `
        <div class="card flex flex-col justify-between h-36 border border-navy-700 bg-navy-800/50 backdrop-blur">
            <div class="flex justify-between items-start">
                <span class="text-sm text-slate-400 font-medium uppercase tracking-wider text-xs">${s.label}</span>
                <div class="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center">
                    <i class="fa-solid ${s.icon} ${s.color} text-sm"></i>
                </div>
            </div>
            <div>
                <div class="stat-value text-white mb-1">${s.value}</div>
                <div class="text-xs ${s.trend === 'Needs Action' ? 'text-red-400' : 'text-slate-500'} flex items-center gap-1">
                    <i class="fa-solid fa-arrow-trend-up"></i> ${s.trend}
                </div>
            </div>
        </div>
    `).join('');

    // Dashboard Grid (Map + Side Panel)
    const dashGrid = document.createElement('div');
    dashGrid.className = 'grid grid-cols-12 gap-lg h-full';

    // Left Column: Map & Zone Status (Span 8)
    const leftCol = document.createElement('div');
    leftCol.className = 'col-span-8 flex flex-col gap-lg';

    leftCol.innerHTML = `
        <div class="card h-96 p-0 overflow-hidden relative border border-navy-700 bg-navy-900 block group">
             <div class="absolute inset-0 flex items-center justify-center">
                <!-- Abstract Map Graphic -->
                <div class="relative w-3/4 h-3/4 opacity-20">
                    <div class="absolute top-10 left-10 w-32 h-32 border-2 border-blue-500 rounded-full"></div>
                    <div class="absolute bottom-10 right-20 w-48 h-48 border-2 border-slate-600 rounded"></div>
                     <div class="absolute top-1/2 left-1/2 w-64 h-64 border border-dashed border-slate-500 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                </div>
                <p class="text-slate-500 flex flex-col items-center z-10">
                    <i class="fa-solid fa-map-location-dot text-4xl mb-2 text-blue-500/50"></i>
                    REAL-TIME VENUE MAP
                </p>
            </div>
            
            <!-- Heatmap Overlays (Fake) -->
            <div class="absolute top-1/4 left-1/3 w-24 h-24 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div class="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div class="absolute top-4 left-4 bg-navy-900/90 backdrop-blur p-sm rounded border border-navy-700 shadow-xl">
                <div class="text-xs text-slate-400 uppercase tracking-widest mb-1">View Mode</div>
                <div class="font-bold text-sm text-blue-400 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group"></i> CROWD DENSITY
                </div>
            </div>
        </div>

        <div class="card border border-navy-700">
            <div class="flex justify-between items-center mb-md">
                <h3 class="font-bold text-lg flex items-center gap-2"><i class="fa-solid fa-dungeon text-slate-400"></i> Gate Status</h3>
                <button class="text-blue-400 text-xs hover:underline uppercase tracking-wider font-bold">View All Gates</button>
            </div>
            <div class="grid grid-cols-2 gap-md">
                ${state.gates.map(gate => `
                    <div id="gate-${gate.id}" class="p-md rounded bg-navy-900 border ${gate.status === 'Congested' ? 'border-red-500/50 bg-red-900/10' : (gate.status === 'Closed' ? 'border-navy-600 opacity-50' : 'border-navy-700')} relative overflow-hidden cursor-pointer hover:bg-navy-800 transition-colors group">
                        <div class="flex justify-between mb-2 relative z-10">
                            <span class="font-bold text-sm">${gate.name}</span>
                            <span class="badge ${gate.status === 'Open' ? 'badge-success' : (gate.status === 'Closed' ? 'bg-slate-600 text-slate-300' : 'badge-danger')} group-hover:scale-105 transition-transform">${gate.status}</span>
                        </div>
                        <div class="flex justify-between text-xs text-slate-400 relative z-10 mb-2">
                            <span>Logged: ${gate.count}</span>
                            <span>Risk: <span class="${gate.crowdLevel === 'Critical' ? 'text-red-500 font-bold' : 'text-green-500'}">${gate.crowdLevel}</span></span>
                        </div>
                         <div class="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden relative z-10">
                            <div class="${gate.status === 'Congested' ? 'bg-red-500' : 'bg-blue-500'} h-full transition-all duration-1000" style="width: ${(gate.count / gate.capacity) * 100}%"></div>
                        </div>
                        ${gate.status === 'Closed' ? '<div class="absolute inset-0 flex items-center justify-center bg-navy-900/50 backdrop-blur-[1px] text-xs font-bold uppercase tracking-widest text-slate-300">CLOSED</div>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Right Column: Alerts and Zones (Span 4)
    const rightCol = document.createElement('div');
    rightCol.className = 'col-span-4 flex flex-col gap-lg';

    rightCol.innerHTML = `
         <div class="card flex-1 border border-navy-700 bg-navy-800/80">
            <div class="flex justify-between items-center mb-md pb-md border-b border-navy-700">
                <h3 class="font-bold text-red-400 flex items-center gap-2"><i class="fa-solid fa-bell"></i> Live Alerts</h3>
                <span class="badge bg-red-500/20 text-red-500">${state.alerts.length} New</span>
            </div>
            <div class="flex flex-col gap-sm overflow-y-auto max-h-80 custom-scrollbar pr-2">
                ${state.alerts.map(alert => `
                    <div class="p-md rounded bg-navy-900 border-l-4 ${alert.type === 'Medical' ? 'border-l-red-500' : 'border-l-amber-500'} border border-navy-700 flex gap-md items-start hover:bg-navy-700 transition-colors cursor-pointer">
                        <div class="mt-1">
                             <i class="fa-solid ${alert.type === 'Medical' ? 'fa-user-nurse text-red-500' : 'fa-triangle-exclamation text-amber-500'}"></i>
                        </div>
                        <div>
                            <div class="flex justify-between items-start w-full">
                                <p class="font-bold text-sm text-slate-200">${alert.type}</p>
                                <span class="text-[10px] text-slate-500">${alert.time}</span>
                            </div>
                            <p class="text-xs text-slate-400 mt-1 leading-relaxed">${alert.message}</p>
                            <p class="text-[10px] text-slate-500 mt-2 uppercase tracking-wider font-bold"><i class="fa-solid fa-location-crosshairs"></i> ${alert.location}</p>
                        </div>
                    </div>
                `).join('')}
                ${state.alerts.length === 0 ? '<p class="text-slate-500 text-sm text-center py-4">No active alerts</p>' : ''}
            </div>
        </div>

        <div class="card flex-1 border border-navy-700">
            <h3 class="font-bold mb-md text-sm uppercase text-slate-400 tracking-wider">Zone Density Breakdown</h3>
             <div class="flex flex-col gap-lg">
                ${state.zones.map(zone => `
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between text-sm">
                            <span class="font-bold">${zone.name}</span>
                            <span class="${zone.density > 80 ? 'text-red-400' : 'text-slate-400'} font-mono">${zone.density}%</span>
                        </div>
                        <div class="w-full bg-navy-900 h-2 rounded-full overflow-hidden">
                            <div class="${zone.density > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : (zone.density > 50 ? 'bg-amber-500' : 'bg-green-500')} h-full relative" style="width: ${zone.density}%"></div>
                        </div>
                        <div class="text-[10px] text-slate-500 text-right flex justify-end gap-2">
                            <span><i class="fa-solid fa-users"></i> ${zone.status}</span>
                            <span><i class="fa-solid fa-user-shield"></i> ${zone.staff} Staff</span>
                        </div>
                    </div>
                `).join('')}
             </div>
        </div>
    `;

    dashGrid.appendChild(leftCol);
    dashGrid.appendChild(rightCol);

    main.appendChild(statsGrid);
    main.appendChild(dashGrid);
    container.appendChild(header);
    container.appendChild(main);

    // Event Listeners for Gates
    state.gates.forEach(gate => {
        container.querySelector(`#gate-${gate.id}`).addEventListener('click', () => {
            store.toggleGateStatus(gate.id);
        });
    });

    // Event Listeners
    header.querySelector('#btn-logout').addEventListener('click', () => {
        store.setRole(null);
    });

    header.querySelector('#btn-emergency').addEventListener('click', () => {
        Modal.show({
            title: 'CONFIRM EMERGENCY BROADCAST',
            message: 'Are you sure you want to broadcast an emergency alert to ALL attendees and staff? This action cannot be undone.',
            type: 'confirm',
            theme: 'dark',
            onConfirm: () => {
                store.addAlert({
                    id: 'a-' + Date.now(),
                    type: 'Emergency',
                    message: 'EMERGENCY EVACUATION ORDER - Please proceed to nearest exits.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'Active',
                    location: 'ALL ZONES'
                });
                Modal.show({
                    title: 'Alert Broadcasted',
                    message: 'The emergency alert has been sent to all active devices.',
                    type: 'info',
                    theme: 'dark'
                });
            }
        });
    });

    return container;
}


// Public Dashboard
function renderPublicDashboard() {
    const state = store.getState();
    const container = document.createElement('div');
    container.className = 'public-view flex flex-col h-full relative font-sans';

    // Header
    const header = document.createElement('header');
    header.className = 'nav-bar shadow-sm sticky top-0 z-20 bg-white/90 backdrop-blur';
    header.innerHTML = `
        <div class="flex items-center gap-sm">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <i class="fa-solid fa-ticket"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold text-navy-900 leading-tight">SafeFlow</h1>
                <p class="text-xs text-slate-500 font-medium">Attendee Portal</p>
            </div>
        </div>
        <button class="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors" id="btn-logout">
            <i class="fa-solid fa-right-from-bracket"></i>
        </button>
    `;

    // Main Scrollable Area
    const main = document.createElement('main');
    main.className = 'flex-1 p-lg flex flex-col gap-lg pb-32 max-w-lg mx-auto w-full'; // Mobile-focused width

    // 1. Event Info Card
    main.innerHTML += `
        <div class="card bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-xl shadow-blue-500/20 border-none relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
            
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-2">
                    <span class="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider backdrop-blur">LIVE NOW</span>
                    <i class="fa-solid fa-music text-white/30 text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold mb-1 leading-tight text-shadow-sm">${state.currentEvent.name}</h2>
                <div class="flex items-center gap-2 text-blue-100 text-sm mb-4">
                    <i class="fa-solid fa-location-dot"></i> ${state.currentEvent.location}
                </div>
                <div class="flex gap-4">
                    <div class="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur text-sm flex items-center gap-2">
                        <i class="fa-solid fa-cloud-sun text-yellow-300"></i> <span class="font-bold">25°C</span> Sunny
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. Crowd Heatmap / Map
    main.innerHTML += `
        <div class="card p-0 overflow-hidden shadow-lg border border-slate-100">
            <div class="p-md bg-white border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-navy-900 flex items-center gap-2"><i class="fa-solid fa-map"></i> Venue Map</h3>
                <span class="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live
                </span>
            </div>
            <div class="bg-slate-50 h-64 flex items-center justify-center relative overflow-hidden">
                 <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-400 to-slate-100"></div>
                 
                 <!-- Map Placeholder Graphics -->
                 <div class="absolute inset-0">
                    ${Array.from({ length: 5 }).map(() => {
        const top = Math.random() * 80 + 10;
        const left = Math.random() * 80 + 10;
        const size = Math.random() * 4 + 2;
        const color = Math.random() > 0.5 ? 'bg-slate-300' : 'bg-slate-200';
        const rounded = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm';
        return `<div class="absolute ${color} ${rounded}" style="top: ${top}%; left: ${left}%; width: ${size}rem; height: ${size}rem; opacity: 0.5;"></div>`;
    }).join('')}
                 </div>
                 
                 <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300 mix-blend-multiply">
                    <i class="fa-solid fa-map-location-dot text-6xl"></i>
                 </div>
                 
                <!-- Randomly placed crowd hotspots -->
                ${Array.from({ length: 3 }).map(() => {
        const top = Math.random() * 70 + 15;
        const left = Math.random() * 70 + 15;
        const color = Math.random() > 0.5 ? 'bg-red-500' : 'bg-amber-500';
        return `
                        <div class="absolute w-20 h-20 ${color}/20 rounded-full blur-xl animate-pulse flex items-center justify-center pointer-events-none" style="top: ${top}%; left: ${left}%">
                             <div class="w-2 h-2 ${color} rounded-full"></div>
                        </div>
                    `;
    }).join('')}

                <!-- User Location Pin -->
                 <div class="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 -translate-y-full">
                    <i class="fa-solid fa-location-dot text-3xl text-blue-600 drop-shadow-md pb-1"></i>
                    <div class="bg-white px-2 py-1 rounded shadow text-[10px] font-bold text-navy-900 whitespace-nowrap transform -translate-x-1/4">You are here</div>
                 </div>
            </div>
            <div class="p-md bg-white">
                <div class="flex justify-between items-center text-sm mb-2">
                    <span class="text-slate-600">Your Zone: <strong class="text-navy-900">Food Court</strong></span>
                    <span class="badge badge-warning flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Crowded</span>
                </div>
                <div class="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                    <i class="fa-solid fa-circle-info mr-1 text-blue-500"></i> Recommendation: Crowd density is increasing. Try the <strong>North Garden</strong> for a quieter spot.
                </div>
            </div>
        </div>
    `;

    // 3. Quick Stats/Facilities
    const facilities = [
        { name: 'Toilets', status: 'High Wait', detail: '15 min', icon: 'fa-restroom', color: 'text-amber-500', bg: 'bg-amber-50' },
        { name: 'Parking', status: 'Available', detail: 'Slot A', icon: 'fa-square-parking', color: 'text-green-500', bg: 'bg-green-50' },
        { name: 'Med Tent', status: 'Open', detail: 'Zone 1', icon: 'fa-user-nurse', color: 'text-red-500', bg: 'bg-red-50' },
        { name: 'Exits', status: 'Clear', detail: 'Gate A, B', icon: 'fa-door-open', color: 'text-blue-500', bg: 'bg-blue-50' }
    ];

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-md';
    grid.innerHTML = facilities.map(f => `
        <div class="card p-md flex flex-row items-center gap-3 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="w-10 h-10 rounded-full ${f.bg} flex items-center justify-center ${f.color} text-lg shrink-0">
                <i class="fa-solid ${f.icon}"></i>
            </div>
            <div class="overflow-hidden">
                <div class="font-bold text-sm text-navy-900 truncate">${f.name}</div>
                <div class="text-xs text-slate-500 truncate">${f.status}</div>
            </div>
        </div>
    `).join('');

    main.appendChild(grid);

    // Active Alerts for Public
    const activeEmergency = state.alerts.find(a => a.type === 'Emergency' && a.status === 'Active');
    if (activeEmergency) {
        const alertBanner = document.createElement('div');
        alertBanner.className = 'bg-red-600 text-white p-md rounded-lg shadow-lg animate-pulse flex items-start gap-md mt-4';
        alertBanner.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
            <div>
                <h3 class="font-bold uppercase">Emergency Alert</h3>
                <p class="text-sm">${activeEmergency.message}</p>
            </div>
        `;
        main.insertBefore(alertBanner, main.firstChild);
    }

    // SOS Button (Fixed at bottom)
    const sosContainer = document.createElement('div');
    sosContainer.className = 'fixed bottom-lg left-0 w-full px-lg flex justify-center z-50 pointer-events-none';

    const sosBtn = document.createElement('button');
    sosBtn.className = 'pointer-events-auto w-full max-w-sm bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-xl py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-red-500/40 ring-4 ring-white/20 backdrop-blur';
    sosBtn.innerHTML = `<i class="fa-solid fa-tower-broadcast animate-pulse"></i> EMERGENCY SOS`;

    sosBtn.onclick = () => {
        Modal.show({
            title: 'TRIGGER SOS ALERT?',
            message: 'Are you sure you want to trigger an SOS? This will share your precise location with emergency response teams.',
            type: 'confirm',
            onConfirm: () => {
                Modal.show({
                    title: 'SOS Signal Sent',
                    message: 'Help is on the way. Please stay where you are if it is safe to do so.',
                    type: 'info'
                });
                // In real app, would call store.addAlert()
            }
        });
    };

    sosContainer.appendChild(sosBtn);
    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(sosContainer);

    header.querySelector('#btn-logout').addEventListener('click', () => {
        store.setRole(null);
    });

    return container;
}


/* --- ROOT LOGIC --- */

const app = document.getElementById('app');

function render() {
    // Clear current content
    app.innerHTML = '';

    const { userRole } = store.getState();

    let page;
    if (userRole === 'authority') {
        page = renderAuthorityDashboard();
    } else if (userRole === 'public') {
        page = renderPublicDashboard();
    } else {
        page = renderLanding();
    }

    app.appendChild(page);
}

// Initial Render
render();

// Subscribe to store changes
store.subscribe(render);
