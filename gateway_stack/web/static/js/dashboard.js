// Infinity-Matrix Dashboard JavaScript

// API base URL
const API_BASE = '/api/v1';

// Fetch and update system status
async function updateSystemStatus() {
    try {
        const response = await fetch(`${API_BASE}/system/status`);
        const data = await response.json();
        
        // Update system status badge
        const statusBadge = document.getElementById('system-status');
        if (data.status === 'operational') {
            statusBadge.querySelector('.indicator').style.background = '#10b981';
            statusBadge.querySelector('span:last-child').textContent = 'System Operational';
        } else {
            statusBadge.querySelector('.indicator').style.background = '#ef4444';
            statusBadge.querySelector('span:last-child').textContent = 'System Issues';
        }
        
        // Update agent counts
        document.getElementById('active-agents').textContent = data.agents.active;
        
    } catch (error) {
        console.error('Error fetching system status:', error);
    }
}

// Fetch and update agents
async function updateAgents() {
    try {
        const response = await fetch(`${API_BASE}/agents`);
        const data = await response.json();
        
        const agentGrid = document.getElementById('agent-grid');
        agentGrid.innerHTML = '';
        
        data.agents.forEach(agent => {
            const agentCard = createAgentCard(agent);
            agentGrid.appendChild(agentCard);
        });
        
    } catch (error) {
        console.error('Error fetching agents:', error);
    }
}

// Create agent card HTML
function createAgentCard(agent) {
    const card = document.createElement('div');
    card.className = 'agent-card';
    
    const statusClass = agent.status === 'running' ? 'running' : 
                       agent.status === 'error' ? 'error' : 'idle';
    
    card.innerHTML = `
        <div class="agent-header">
            <h4>${agent.name.charAt(0).toUpperCase() + agent.name.slice(1)}</h4>
            <span class="status ${statusClass}">${agent.status}</span>
        </div>
        <p class="agent-type">${agent.type}</p>
        <div class="agent-stats">
            <span>Executions: ${agent.executions || 0}</span>
            <span>Success: ${agent.success_rate || 0}%</span>
        </div>
    `;
    
    return card;
}

// Fetch and update events
async function updateEvents() {
    try {
        const response = await fetch(`${API_BASE}/events?limit=5`);
        const data = await response.json();
        
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = '';
        
        data.events.forEach(event => {
            const eventDiv = createEventElement(event);
            eventsList.appendChild(eventDiv);
        });
        
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Create event HTML element
function createEventElement(event) {
    const div = document.createElement('div');
    div.className = 'event';
    
    const timeAgo = formatTimeAgo(event.timestamp);
    
    div.innerHTML = `
        <span class="event-time">${timeAgo}</span>
        <span class="event-type">${event.event_type}</span>
        <span class="event-message">${event.message}</span>
    `;
    
    return div;
}

// Format timestamp to relative time
function formatTimeAgo(timestamp) {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now - eventTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Initialize dashboard
function initDashboard() {
    updateSystemStatus();
    updateAgents();
    updateEvents();
    
    // Refresh data every 30 seconds
    setInterval(() => {
        updateSystemStatus();
        updateAgents();
        updateEvents();
    }, 30000);
}

// Run on page load
document.addEventListener('DOMContentLoaded', initDashboard);
