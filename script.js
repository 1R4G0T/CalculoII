window.onload = function() {
    // 1. Controle de Abas (Mantido)
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

    // === 2. GRÁFICO 2D: O PLANO CARTESIANO E dA ===
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2; const cy = cv2d.height / 2;
        
        ctx.clearRect(0, 0, cv2d.width, cv2d.height);

        // Desenho dos Eixos X e Y com setas
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        // Eixo X
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(cv2d.width-20, cy); ctx.stroke();
        // Eixo Y
        ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, cv2d.height-20); ctx.stroke();
        
        // Rótulos dos Eixos
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('X', cv2d.width - 15, cy + 15);
        ctx.fillText('Y', cx - 15, 15);

        // O Elemento Diferencial dA como um Retângulo (Base x Altura)
        const posX = cx + 2 * escala;
        const posY = cy - 2 * escala;
        const dx_vis = 18; // largura visual do dx
        const dy_vis = 18; // largura visual do dy

        // Preenchimento do dA
        ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.fillRect(posX, posY - dy_vis, dx_vis, dy_vis);
        
        // Linhas de cota para dx e dy (como se fosse base e altura)
        ctx.strokeStyle = '#c0392b';
        ctx.setLineDash([]);
        ctx.font = '12px Arial';
        // Indica dx na base
        ctx.fillText('dx', posX + 3, posY + 12);
        // Indica dy na lateral
        ctx.fillText('dy', posX + dx_vis + 2, posY - 5);
        
        // Rótulo Geral: A = b * h
        ctx.fillStyle = '#c0392b';
        ctx.fillText('dA = dx · dy', posX - 20, posY - dy_vis - 10);
    }

    // === 3. GRÁFICO DE CORTE: VOLUME -> ÁREA ===
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; const cy = cvCorte.height - 50;

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);

        // Eixos
        ctx.strokeStyle = '#333';
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width-20, cy); ctx.stroke(); // Eixo X
        ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, cy+10); ctx.stroke(); // Eixo T

        // Curva Gaussiana
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        for(let x = -6; x <= 6; x += 0.1) {
            let px = cx + x * escala;
            let py = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Pilar Diferencial: Interpretando como Área de um Retângulo
        const xFix = 2;
        const pilarX = cx + xFix * escala;
        const pilarH = getTempAt(xFix, 0) * 0.8;
        const pilarL = 15; // nosso dx visual

        // Retângulo da fatia
        ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
        ctx.fillRect(pilarX, cy - pilarH, pilarL, pilarH);
        
        // Marcação de Altura e Base
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.fillText('h = T(x,y)', pilarX - 55, cy - pilarH/2); // Altura é a função
        ctx.fillText('b = dx', pilarX, cy + 15);              // Base é o diferencial
        
        ctx.font = 'bold 12px Arial';
        ctx.fillText('Área da fatia = T(x,y) · dx', pilarX - 40, cy - pilarH - 15);
    }

    // === 4. GRÁFICO 3D (Plotly) ===
    // (Mantido conforme anterior para visualização da superfície)
    const xV = [], yV = [], zV = [];
    for(let i=-6; i<=6; i+=0.4) xV.push(i);
    for(let j=-5; j<=5; j+=0.4) yV.push(j);
    for(let j=0; j<yV.length; j++) {
        let r = [];
        for(let i=0; i<xV.length; i++) { r.push(getTempAt(xV[i], yV[j])); }
        zV.push(r);
    }
    Plotly.newPlot('plot3d', [{z: zV, x: xV, y: yV, type: 'surface', colorscale: 'Hot'}], 
    {margin: {l:0, r:0, b:0, t:0}, autosize: true});
};
Plotly.newPlot('plot3d', [{
    z: zV, x: xV, y: yV, 
    type: 'surface', 
    colorscale: 'Blues', // Azul minimalista
    reversescale: true
}], { 
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    scene: {
        xaxis: { gridcolor: '#334155', color: '#94a3b8' },
        yaxis: { gridcolor: '#334155', color: '#94a3b8' },
        zaxis: { gridcolor: '#334155', color: '#94a3b8' }
    },
    margin: {l:0, r:0, b:0, t:0}
});
