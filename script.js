window.onload = function() {
    // 1. Controle de Abas
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
    function getTempAt(x, y) { return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40; }

    // === 2. GRÁFICO 3D (Plotly Dark Minimalista) ===
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
        colorscale: 'Blues', 
        reversescale: true,
        showscale: false // Remove a barra lateral para ficar mais limpo
    }], { 
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        scene: {
            xaxis: { gridcolor: '#1e293b', color: '#94a3b8', title: 'x' },
            yaxis: { gridcolor: '#1e293b', color: '#94a3b8', title: 'y' },
            zaxis: { gridcolor: '#1e293b', color: '#94a3b8', title: 'T' }
        },
        margin: {l:0, r:0, b:0, t:0}
    });

    // === 3. GRÁFICO DE CORTE (Canvas Dark - Foco no Diferencial) ===
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; const cy = cvCorte.height - 50;

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);

        // Eixos Cartesianos (Cinza minimalista)
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width-20, cy); ctx.stroke(); // Eixo X
        ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, cy+10); ctx.stroke(); // Eixo T

        // Rótulos dos eixos (Branco)
        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px Inter, Arial';
        ctx.fillText('x (Abscissas)', cvCorte.width - 80, cy + 25);
        ctx.fillText('T (Temperatura)', cx + 10, 20);

        // Curva Gaussiana (Azul Claro Vibrante)
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        for(let x = -6; x <= 6; x += 0.1) {
            let px = cx + x * escala;
            let py = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Pilar Diferencial dx (A área da fatia)
        const xFix = 2;
        const pilarX = cx + xFix * escala;
        const pilarH = getTempAt(xFix, 0) * 0.8;
        const pilarL = 18; 

        // Retângulo da fatia (Preenchimento suave)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(pilarX, cy - pilarH, pilarL, pilarH);
        
        // Bordas do pilar (Destaque)
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(pilarX, cy - pilarH, pilarL, pilarH);
        ctx.setLineDash([]);
        
        // Indicações de b (base) e h (altura)
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('h = T(x,0)', pilarX - 60, cy - pilarH/2);
        ctx.fillText('b = dx', pilarX, cy + 15);
        
        ctx.font = 'bold 12px Inter';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Área = T(x,y) · dx', pilarX - 30, cy - pilarH - 15);
    }
};
