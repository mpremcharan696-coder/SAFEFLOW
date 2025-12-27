import { store } from './data/store.js';
import { renderLanding } from './pages/Landing.js';
import { renderAuthorityDashboard } from './pages/AuthorityDashboard.js';
import { renderPublicDashboard } from './pages/PublicDashboard.js';

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
