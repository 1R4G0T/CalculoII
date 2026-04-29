window.onload = function() {
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // --- GRÁFICO 3D ---
    const xV = [], yV = [], zV = [];
    for(let i=-6; i<=6; i+=0.4) xV.push(i);
    for(let j=-5; j<=5; j+=0.4) yV.push(j);
    for(let j=0; j<yV.length; j++) {
        let r = [];
        for(let i=0; i<xV.length; i++) r.push(getTempAt(xV[i], yV[j]));
        zV.push(r);
    }

    Plotly.newPlot('plot3d', [{
        z: zV, x: xV, y: yV, type: 'surface',
        colorscale: 'Hot' // Mantém a cor das suas imagens
    }], {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        scene: { xaxis: {color: '#fff'}, yaxis: {color: '#fff'}, zaxis: {color: '#fff'} },
        margin: {l:0, r:0, b:0, t:0}
    });

    // --- GRÁFICO DE CORTE (Fatia dx) ---
    const cv = document.getElementById('graficoCorte');
    if (cv) {
        const ctx = cv.getContext('2d');
        const cx = cv.width/2; const cy = cv.height - 50;
        const esc = 25;

        // Curva Gaussiana
        ctx.beginPath();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
        for(let x = -6; x <= 6; x += 0.1) {
            let px = cx + x * esc;
            let py = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Pilar dx (conforme imagem dcf166)
        ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
        ctx.fillRect(cx + 2 * esc, cy - (getTempAt(2,0)*0.8), 15, getTempAt(2,0)*0.8);
        ctx.fillStyle = '#fff';
        ctx.fillText('dx', cx + 2 * esc + 2, cy + 15);
    }
    
    // Controle do Botão "Esconder"
    document.getElementById('btn-toggle').onclick = function() {
        const conteudo = document.getElementById('conteudo-calculo');
        const isHidden = conteudo.classList.toggle('hidden');
        this.innerHTML = isHidden ? '▶ Mostrar Memorial' : '▼ Esconder';
    };
};
