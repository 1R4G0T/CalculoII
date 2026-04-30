window.onload = function() {
    // FUNÇÃO PARA OS BOTÕES FUNCIONAREM
    function setupToggle(btnId, contentId) {
        const btn = document.getElementById(btnId);
        const content = document.getElementById(contentId);
        if (btn && content) {
            btn.onclick = function() {
                content.classList.toggle('hidden');
                const isHidden = content.classList.contains('hidden');
                this.innerHTML = (isHidden ? "▶ " : "▼ ") + this.innerText.substring(2);
                
                // Recarrega fórmulas matemáticas se houver
                if (!isHidden && window.MathJax) {
                    MathJax.typesetPromise();
                }
            };
        }
    }

    setupToggle('btn-toggle', 'conteudo-calculo');
    setupToggle('btn-analise', 'conteudo-analise');

    // DESENHO DOS GRÁFICOS 2D
    function renderCanvas() {
        const cv = document.getElementById('meuGrafico2d');
        if (!cv) return;
        
        const ctx = cv.getContext('2d');
        cv.width = cv.parentElement.clientWidth;
        cv.height = 300;
        
        const cx = cv.width / 2;
        const cy = cv.height / 2;
        const escala = 25;

        ctx.clearRect(0, 0, cv.width, cv.height);

        // 1. DESENHAR EIXOS (PRETO)
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        
        ctx.beginPath(); // Eixo X
        ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); ctx.stroke();
        
        ctx.beginPath(); // Eixo Y
        ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height); ctx.stroke();

        // 2. DESENHAR O PILAR dA (VERMELHO)
        ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
        ctx.strokeStyle = "#ff0000";
        const dx = 20, dy = 20;
        const xPos = cx + (2 * escala); 
        const yPos = cy - (3 * escala);
        
        ctx.fillRect(xPos, yPos, dx, dy);
        ctx.strokeRect(xPos, yPos, dx, dy);

        // 3. TEXTOS E LEGENDAS
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.fillText("X (cm)", cv.width - 50, cy + 20);
        ctx.fillText("Y (cm)", cx + 10, 20);
        ctx.fillText("dA = dx.dy", xPos - 10, yPos - 10);
    }

    renderCanvas();
    
    // GRÁFICO 3D (PLOTLY)
    const data3d = [{
        z: Array.from({length: 30}, (_, y) => 
           Array.from({length: 30}, (_, x) => 
           150 * Math.exp(-0.1 * (Math.pow((x-15)/5, 2) + Math.pow((y-15)/5, 2))) + 40)
        ),
        type: 'surface',
        colorscale: 'Viridis'
    }];
    
    Plotly.newPlot('plot3d', data3d, {
        margin: {l:0, r:0, b:0, t:0},
        scene: { xaxis: {title: 'X'}, yaxis: {title: 'Y'}, zaxis: {title: 'T (°C)'} }
    });
};
