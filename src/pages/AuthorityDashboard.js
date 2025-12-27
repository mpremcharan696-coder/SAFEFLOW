import { store } from '../data/store.js';

export function renderAuthorityDashboard() {
    const state = store.getState();
    const container = document.createElement('div');
    container.className = 'auth-view flex flex-col h-full';

    // Header
    const header = document.createElement('header');
    header.className = 'nav-bar shadow';
    header.innerHTML = `
        <div class="flex items-center gap-md">
            <i class="fa-solid fa-shield-halved text-blue-500 text-2xl"></i>
            <div>
                <h1 class="text-xl font-bold">Authority Command Center</h1>
                <p class="text-xs text-slate-400">Live Monitoring - ${state.currentEvent.name}</p>
            </div>
        </div>
        <div class="flex items-center gap-md">
            <button class="btn btn-danger text-sm" id="btn-emergency">
                <i class="fa-solid fa-triangle-exclamation"></i> BROADCAST ALERT
            </button>
            <div class="flex items-center gap-sm text-sm text-slate-300">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                System Online
            </div>
            <button class="btn btn-outline text-xs" id="btn-logout">Logout</button>
        </div>
    `;

    // Main Content
    const main = document.createElement('main');
    main.className = 'flex-1 p-lg overflow-y-auto';

    // Top Stats Row
    const statsGrid = document.createElement('div');
    statsGrid.className = 'grid grid-cols-4 gap-md mb-lg';

    const stats = [
        { label: 'Total Attendance', value: state.currentEvent.currentAttendance.toLocaleString(), icon: 'fa-users', color: 'text-blue-500' },
        { label: 'Venue Capacity', value: `${state.currentEvent.currentAttendance / state.currentEvent.totalCapacity * 100}%`, icon: 'fa-chart-pie', color: 'text-green-500' },
        { label: 'Active Alerts', value: state.alerts.filter(a => a.status === 'Active').length, icon: 'fa-bell', color: 'text-red-500' },
        { label: 'Security Staff', value: '42 Active', icon: 'fa-user-shield', color: 'text-amber-500' }
    ];

    statsGrid.innerHTML = stats.map(s => `
        <div class="card flex flex-col justify-between h-32">
            <div class="flex justify-between items-start">
                <span class="text-sm text-slate-400 font-medium">${s.label}</span>
                <i class="fa-solid ${s.icon} ${s.color} text-lg"></i>
            </div>
            <div class="stat-value text-white">${s.value}</div>
        </div>
    `).join('');

    // Dashboard Grid (Map + Side Panel)
    const dashGrid = document.createElement('div');
    dashGrid.className = 'grid grid-cols-3 gap-lg h-full'; // 2 columns for map, 1 for details
    dashGrid.style.gridTemplateColumns = '2fr 1fr';

    // Left Column: Map & Zone Status
    const leftCol = document.createElement('div');
    leftCol.className = 'flex flex-col gap-lg';

    leftCol.innerHTML = `
        <div class="card h-96 p-0 overflow-hidden relative border border-navy-700 block">
             <div class="absolute inset-0 bg-navy-800 flex items-center justify-center">
                <p class="text-slate-500 flex flex-col items-center">
                    <i class="fa-solid fa-map text-4xl mb-2"></i>
                    Interactive Venue Map Loading...
                </p>
            </div>
            <!-- Overlay some live data patches -->
            <div class="absolute top-4 left-4 bg-navy-900/90 backdrop-blur p-sm rounded border border-navy-700">
                <div class="text-xs text-slate-400">Map View</div>
                <div class="font-bold text-sm"> crowd Heatmap Overlay</div>
            </div>
        </div>

        <div class="card">
            <div class="flex justify-between items-center mb-md">
                <h3 class="font-bold">Gate Status</h3>
                <button class="text-blue-400 text-sm hover:underline">Manage Gates</button>
            </div>
            <div class="grid grid-cols-2 gap-md">
                ${state.gates.map(gate => `
                    <div class="p-md rounded bg-navy-900 border ${gate.status === 'Congested' ? 'border-red-500/50' : 'border-navy-700'}">
                        <div class="flex justify-between mb-2">
                            <span class="font-bold text-sm">${gate.name}</span>
                            <span class="badge ${gate.status === 'Open' ? 'badge-success' : 'badge-danger'}">${gate.status}</span>
                        </div>
                        <div class="flex justify-between text-xs text-slate-400">
                            <span>Count: ${gate.count}</span>
                            <span>Level: <span class="${gate.crowdLevel === 'Critical' ? 'text-red-500 font-bold' : 'text-green-500'}">${gate.crowdLevel}</span></span>
                        </div>
                         <div class="w-full bg-navy-700 h-1 mt-2 rounded-full overflow-hidden">
                            <div class="bg-blue-500 h-full" style="width: ${(gate.count / gate.capacity) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Right Column: Alerts and Zones
    const rightCol = document.createElement('div');
    rightCol.className = 'flex flex-col gap-lg';

    rightCol.innerHTML = `
         <div class="card flex-1">
            <div class="flex justify-between items-center mb-md">
                <h3 class="font-bold text-red-400"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Recent Alerts</h3>
            </div>
            <div class="flex flex-col gap-sm overflow-y-auto max-h-60">
                ${state.alerts.map(alert => `
                    <div class="p-sm rounded bg-red-900/20 border border-red-900/50 flex gap-sm items-start">
                        <i class="fa-solid fa-circle-exclamation text-red-500 mt-1"></i>
                        <div>
                            <p class="font-bold text-sm text-red-200">${alert.type}</p>
                            <p class="text-xs text-slate-400">${alert.message}</p>
                            <p class="text-xs text-slate-500 mt-1">${alert.time} • ${alert.location}</p>
                        </div>
                    </div>
                `).join('')}
                ${state.alerts.length === 0 ? '<p class="text-slate-500 text-sm">No active alerts</p>' : ''}
            </div>
        </div>

        <div class="card flex-1">
            <h3 class="font-bold mb-md">Zone Density</h3>
             <div class="flex flex-col gap-md">
                ${state.zones.map(zone => `
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between text-sm">
                            <span>${zone.name}</span>
                            <span class="${zone.density > 80 ? 'text-red-400' : 'text-slate-400'}">${zone.density}%</span>
                        </div>
                        <div class="w-full bg-navy-700 h-2 rounded-full overflow-hidden">
                            <div class="${zone.density > 80 ? 'bg-red-500' : (zone.density > 50 ? 'bg-amber-500' : 'bg-green-500')} h-full" style="width: ${zone.density}%"></div>
                        </div>
                        <div class="text-xs text-slate-500 text-right">Staff: ${zone.staff}</div>
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

    // Event Listeners
    header.querySelector('#btn-logout').addEventListener('click', () => {
        store.setRole(null);
    });

    header.querySelector('#btn-emergency').addEventListener('click', () => {
        alert('BROADCASTING EMERGENCY ALERT TO ALL ZONES AND PUBLIC APP');
    });

    return container;
}
