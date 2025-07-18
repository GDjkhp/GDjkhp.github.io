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

async function updateServerCounts() {
    try {
        const table_zero = document.getElementsByTagName("table")[0];
        const tbody = table_zero.getElementsByTagName('tbody')[0];
        const rows = tbody.getElementsByTagName('tr');

        for (let row of rows) {
            const botName = row.cells[0].textContent.trim();
            const serverCell = row.cells[1];

            const response = await fetch(`https://45600.site.bot-hosting.net/bot/${botName}`);
            const data = await response.json();
            serverCell.textContent = `${data.guild_count || '?'}/100`;
        }
    } catch (error) {
        console.error('Error updating server counts:', error);
    }
}