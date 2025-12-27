import { store } from '../data/store.js';

export function renderPublicDashboard() {
    const state = store.getState();
    const container = document.createElement('div');
    container.className = 'public-view flex flex-col h-full relative';

    // Header
    const header = document.createElement('header');
    header.className = 'nav-bar shadow-sm sticky top-0 z-10';
    header.innerHTML = `
        <div class="flex items-center gap-sm">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <i class="fa-solid fa-ticket"></i>
            </div>
            <div>
                <h1 class="text-lg font-bold text-navy-900 leading-tight">SafeFlow</h1>
                <p class="text-xs text-slate-500">Attendee Portal</p>
            </div>
        </div>
        <button class="text-navy-700" id="btn-logout">
            <i class="fa-solid fa-right-from-bracket"></i>
        </button>
    `;

    // Main Scrollable Area
    const main = document.createElement('main');
    main.className = 'flex-1 p-lg flex flex-col gap-lg pb-32'; // Padding bottom for fixed SOS button

    // 1. Event Info Card
    main.innerHTML += `
        <div class="card bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg border-none">
            <h2 class="text-2xl font-bold mb-1">${state.currentEvent.name}</h2>
            <div class="flex items-center gap-2 text-blue-100 text-sm mb-4">
                <i class="fa-solid fa-location-dot"></i> ${state.currentEvent.location}
            </div>
            <div class="flex gap-4">
                <div class="bg-white/20 px-3 py-1 rounded backdrop-blur text-sm">
                    <span class="font-bold">25°C</span> Sunny
                </div>
                <div class="bg-white/20 px-3 py-1 rounded backdrop-blur text-sm flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-400"></div> Event Live
                </div>
            </div>
        </div>
    `;

    // 2. Crowd Heatmap / Map
    main.innerHTML += `
        <div class="card p-0 overflow-hidden shadow">
            <div class="p-md border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-navy-900">Venue Map</h3>
                <span class="text-xs text-blue-500 font-semibold">Live Updates</span>
            </div>
            <div class="bg-slate-200 h-64 flex items-center justify-center relative">
                 <p class="text-slate-400 flex flex-col items-center">
                    <i class="fa-solid fa-map-location-dot text-3xl mb-2"></i>
                    Interactive Map
                </p>
                <!-- Simulated crowded zones -->
                <div class="absolute top-1/4 left-1/4 w-16 h-16 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                <div class="absolute bottom-1/3 right-1/4 w-20 h-20 bg-amber-500/30 rounded-full blur-xl"></div>
            </div>
            <div class="p-md bg-white">
                <div class="flex justify-between items-center text-sm mb-2">
                    <span class="text-slate-600">Your Zone: <strong>Food Court</strong></span>
                    <span class="badge badge-warning">Crowded</span>
                </div>
                <div class="text-xs text-slate-500">
                    <i class="fa-solid fa-arrow-trend-up mr-1 text-red-500"></i> Crowd increasing in this area. Suggest moving to Zone 3.
                </div>
            </div>
        </div>
    `;

    // 3. Quick Stats/Facilities
    const facilities = [
        { name: 'Toilets', status: 'High Wait', time: '15 min', icon: 'fa-restroom', color: 'text-amber-500' },
        { name: 'Parking', status: 'Avail', time: 'Slot A', icon: 'fa-square-parking', color: 'text-green-500' },
        { name: 'Med Tent', status: 'Open', time: 'Zone 1', icon: 'fa-briefcase-medical', color: 'text-red-500' },
        { name: 'Exits', status: 'Clear', time: 'Gate A', icon: 'fa-door-open', color: 'text-blue-500' }
    ];

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-md';
    grid.innerHTML = facilities.map(f => `
        <div class="card p-md flex flex-col items-center text-center gap-2 shadow-sm border border-slate-100">
            <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${f.color} text-xl">
                <i class="fa-solid ${f.icon}"></i>
            </div>
            <div>
                <div class="font-bold text-sm text-navy-900">${f.name}</div>
                <div class="text-xs text-slate-500">${f.status} • ${f.time}</div>
            </div>
        </div>
    `).join('');

    main.appendChild(grid);

    // SOS Button (Fixed at bottom)
    const sosContainer = document.createElement('div');
    sosContainer.className = 'fixed bottom-lg left-0 w-full px-lg flex justify-center z-50';

    const sosBtn = document.createElement('button');
    sosBtn.className = 'w-full max-w-sm bg-red-600 text-white font-bold text-xl py-4 rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-red-700 hover:scale-105 transition-all shadow-red-500/50';
    sosBtn.innerHTML = `<i class="fa-solid fa-tower-broadcast animate-pulse"></i> EMERGENCY SOS`;

    sosBtn.onclick = () => {
        if (confirm("Are you sure you want to trigger an SOS alert? This will share your location with authorities.")) {
            alert("SOS SENT! Authorities are being dispatched to your location.");
            // In real app, would call store.addAlert()
        }
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
