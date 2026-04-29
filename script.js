window.onload = function() {
    // === CONTROLE DE INTERFACE ===
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);
        if (btn && conteudo) {
            btn.onclick = function() {
                const visivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !visivel);
                this.innerHTML = visivel ? `▼ Esconder` : `▶ Mostrar`;
                if (visivel) {
                    Plotly.Plots.resize('plot3d');
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }
    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    const escala = 25;
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // === 1. DISTRIBUIÇÃO TÉRMICA 3D (Plotly Dark) ===
    const xV = [], yV = [], zV = [];
    for(let i=-6; i<=6; i+=0.4) xV.push(i);
    for(let j=-5; j<=5; j+=0.4) yV.push(j);
    for(let j=0; j<yV.length; j++) {
        let r = [];
        for(let i=0; i<xV.length; i++) { r.push(getTempAt(xV[i], yV[j])); }
        zV.push(r);
    }

    Plotly.newPlot('plot3d', [{
        z: zV, x: xV, y: yV, 
        type: 'surface', 
        colorscale: [[0, '#0f172a'], [0.5, '#38bdf8'], [1, '#f8fafc']], 
        showscale: false
    }], { 
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        scene: {
            xaxis: { gridcolor: '#334155', color: '#94a3b8', title: 'X (cm)' },
            yaxis: { gridcolor: '#334155', color: '#94a3b8', title: 'Y (cm)' },
            zaxis: { gridcolor: '#334155', color: '#94a3b8', title: 'Temp (°C)' }
        },
        margin: {l:0, r:0, b:0, t:0}
    });

    // === 2. PERFIL DE CORTE (Canvas Dark - h*b) ===
    const cv = document.getElementById('graficoCorte');
    if (cv) {
        const ctx = cv.getContext('2d');
        const cx = cv.width / 2; const cy = cv.height - 50;

        ctx.clearRect(0, 0, cv.width, cv.height);

        // Eixos Cartesianos
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(cv.width - 20, cy); // Eixo X
        ctx.moveTo(cx, 10); ctx.lineTo(cx, cy + 10);      // Eixo T
        ctx.stroke();

        // Rótulos Brancos
        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px Inter';
        ctx.fillText('X (cm)', cv.width - 50, cy + 20);
        ctx.fillText('T(x,y)', cx + 10, 20);

        // Curva de Temperatura (Azul Cyan)
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        for(let x = -6; x <= 6; x += 0.1) {
            let px = cx + x * escala;
            let py = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Elemento de Área (Pilar dx)
        const xPos = 1.8;
        const pX = cx + xPos * escala;
        const pH = getTempAt(xPos, 0) * 0.8;
        
        // Retângulo dA = h * b
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.fillRect(pX, cy - pH, 15, pH); 
        
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(pX, cy - pH, 15, pH);
        
        ctx.setLineDash([]);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('b = dx', pX - 5, cy + 15);
        ctx.fillText('h = T(x,0)', pX - 25, cy - pH - 10);
    }
};
