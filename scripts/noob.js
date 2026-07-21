document.addEventListener('DOMContentLoaded', function() {
    var style = document.createElement("style");
    style.innerHTML = `
    #particles-js { 
        width: 100%; 
        height: 100%; 
        position: fixed; 
    } 
    .markdown-body {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 1;
    }
    body { 
        background-color: black; 
        color: white; 
    }
    tr, th, td {
        background-color: black;
    }
    h1 {
        text-align: center;
    }
    .github {
        display: none;
    }
    @media (min-width: 820px) {
        .right {
            float: right;
        }
        .br {
            display: none;
        }
    `;
    document.head.appendChild(style);

    var particlesDiv = document.createElement("div");
    particlesDiv.setAttribute("id", "particles-js");
    document.body.appendChild(particlesDiv);

    var particlesScript = document.createElement("script");
    particlesScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js");
    document.body.appendChild(particlesScript);

    var configScript = document.createElement("script");
    configScript.setAttribute("src", "https://gdjkhp.github.io/scripts/particlesjs-config.js");
    document.body.appendChild(configScript);

    updateServerCounts();
});

function formatUptime(unixTimestamp) {
    const startMs = unixTimestamp * 1000;
    const elapsedMs = Date.now() - startMs;
    const totalSeconds = Math.floor(elapsedMs / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function updateServerCounts() {
    try {
        const table_zero = document.getElementsByTagName("table")[0];
        const tbody = table_zero.getElementsByTagName('tbody')[0];
        const rows = tbody.getElementsByTagName('tr');

        for (let row of rows) {
            const botName = row.cells[0].textContent.trim();
            const serverCell = row.cells[1];
            const latencyCell = row.cells[2];
            const uptimeCell = row.cells[3];

            const response = await fetch(`https://noobgpt.gdjkhp.com/bot/${botName}`);
            const data = await response.json();
            serverCell.textContent = `${data.guild_count || '?'}`;
            latencyCell.textContent = `${data.latency || '?ms'}`;
            uptimeCell.textContent = `${formatUptime(data.start_time) || '??:??:??:??'}`;

            setInterval(() => {
                uptimeCell.textContent = formatUptime(data.start_time);
            }, 1000);
        }
    } catch (error) {
        console.error('Error updating server counts:', error);
    }
}