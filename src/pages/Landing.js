import { store } from '../data/store.js';

export function renderLanding() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center h-full bg-slate-900 text-white p-xl';

    container.innerHTML = `
        <div class="text-center max-w-2xl">
            <h1 class="text-3xl font-bold mb-4 text-blue-400">SafeFlow</h1>
            <p class="text-xl text-slate-300 mb-8">Next-Generation Event Venue Safety Management System</p>
            
            <div class="grid grid-cols-2 gap-lg w-full">
                <button id="btn-authority" class="card hover:shadow-lg transition-all cursor-pointer bg-navy-800 border border-navy-700 flex flex-col items-center p-xl gap-md group">
                    <i class="fa-solid fa-shield-halved text-4xl text-blue-500 group-hover:scale-110 transition-transform"></i>
                    <h2 class="text-xl font-bold">Authority Login</h2>
                    <p class="text-sm text-slate-400">For Police, Security, and Event Admins</p>
                </button>

                <button id="btn-public" class="card hover:shadow-lg transition-all cursor-pointer bg-navy-800 border border-navy-700 flex flex-col items-center p-xl gap-md group">
                    <i class="fa-solid fa-users text-4xl text-green-500 group-hover:scale-110 transition-transform"></i>
                    <h2 class="text-xl font-bold">Public Portal</h2>
                    <p class="text-sm text-slate-400">For Attendees and Visitors</p>
                </button>
            </div>
        </div>
    `;

    container.querySelector('#btn-authority').addEventListener('click', () => {
        store.setRole('authority');
    });

    container.querySelector('#btn-public').addEventListener('click', () => {
        store.setRole('public');
    });

    return container;
}
