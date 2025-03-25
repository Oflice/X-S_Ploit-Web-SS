document.addEventListener('DOMContentLoaded', () => {
    const codeEl = document.getElementById('code');
    const executeBtn = document.getElementById('execute');
    const clearBtn = document.getElementById('clear');
    const outputEl = document.getElementById('output');
    const statusEl = document.getElementById('status');
    
    const CONFIG = {
        SERVER_URL: 'http://localhost:3000/api/commands',
        AUTH_KEY: 'X3D' // Must match Node.js and Roblox scripts
    };
    
    // Add message to output
    function log(message, isError = false) {
        const line = document.createElement('div');
        line.textContent = message;
        line.className = isError ? 'error' : '';
        outputEl.appendChild(line);
        outputEl.scrollTop = outputEl.scrollHeight;
    }
    
    // Test connection to Node.js server
    async function testConnection() {
        try {
            const response = await fetch(`${CONFIG.SERVER_URL}?auth=${CONFIG.AUTH_KEY}`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Update connection status
    async function updateStatus() {
        const connected = await testConnection();
        statusEl.textContent = connected ? 'Connected' : 'Disconnected';
        statusEl.className = `status ${connected ? 'connected' : 'disconnected'}`;
        return connected;
    }
    
    // Execute code in Roblox Studio
    async function executeCode() {
        const code = codeEl.value.trim();
        if (!code) return;
        
        log(`[${new Date().toLocaleTimeString()}] Sending code...`);
        
        try {
            const response = await fetch(CONFIG.SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auth: CONFIG.AUTH_KEY,
                    code: code
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                log(`[${new Date().toLocaleTimeString()}] Code queued (ID: ${data.id})`);
            } else {
                log(`[${new Date().toLocaleTimeString()}] Error: ${data.error || 'Unknown error'}`, true);
            }
        } catch (error) {
            log(`[${new Date().toLocaleTimeString()}] Connection error: ${error.message}`, true);
            updateStatus();
        }
    }
    
    // Clear output
    function clearOutput() {
        outputEl.innerHTML = '';
    }
    
    // Event listeners
    executeBtn.addEventListener('click', executeCode);
    clearBtn.addEventListener('click', clearOutput);
    
    // Initialize
    updateStatus();
    setInterval(updateStatus, 5000); // Check connection every 5 seconds
    
    // Example of receiving simulated responses (in a real app you'd poll for execution results)
    setInterval(() => {
        if (Math.random() > 0.7) {
            log(`[${new Date().toLocaleTimeString()}] Simulated execution complete`);
        }
    }, 3000);
});