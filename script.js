window.onload = function() {
    // 1. Função de Temperatura (Gaussiana + Constante)
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // --- GRÁFICO 3D (Plotly) ---
    const xV = [], yV = [], zV = [];
    for(let i=-6; i<=6; i+=0.4) xV.push(i);
    for(let j=-5; j<=5; j+=0.4) yV.push(j);
    for(let j=0; j<yV.length; j++) {
        let r = [];
        for(let i=0; i<xV.length; i++) r.push(getTempAt(xV[i], yV[j]));
        zV.push(r);
    }

    Plotly.newPlot('plot3d', [{
        z: zV, x: xV, y: yV, type: 'surface', colorscale: 'Hot'
    }], {
        paper_bgcolor: 'rgba(0,0,0,0)',
        scene: { 
            xaxis: {color: '#fff'}, yaxis: {color: '#fff'}, zaxis: {color: '#fff'} 
        },
        margin: {l:0, r:0, b:0, t:0}
    });

    // --- GRÁFICO 2D (Domínio dA) ---
    const cv2d = document.getElementById('meuGrafico2d');
    if(cv2d) {
        const ctx = cv2d.getContext('2d');
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(50, 50, 300, 200);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(200, 120, 20, 20); // Elemento dA
        ctx.fillStyle = '#fff';
        ctx.fillText('dA = dx · dy', 225, 135);
    }

    // --- GRÁFICO DE CORTE (Perfil dx) ---
    const cvCorte = document.getElementById('graficoCorte');
    if(cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = 200, cy = 250, esc = 25;
        ctx.beginPath();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
        for(let x=-6; x<=6; x+=0.1) {
            let px = cx + x * esc;
            let py = cy - (getTempAt(x, 0) * 0.8);
            if(x===-6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
        ctx.fillRect(cx + 1.5*esc, cy - (getTempAt(1.5,0)*0.8), 15, getTempAt(1.5,0)*0.8);
        ctx.fillStyle = '#fff';
        ctx.fillText('dx', cx + 1.5*esc, cy + 15);
    }

    // --- CONTROLE DE ABAS ---
    const btnToggle = document.getElementById('btn-toggle');
    const conteudoCalculo = document.getElementById('conteudo-calculo');
    btnToggle.onclick = () => {
        const isHidden = conteudoCalculo.classList.toggle('hidden');
        btnToggle.innerHTML = isHidden ? '▶ Mostrar Desenvolvimento' : '▼ Esconder Memorial';
    };

    const btnAnalise = document.getElementById('btn-analise');
    const conteudoAnalise = document.getElementById('conteudo-analise');
    btnAnalise.onclick = () => {
        const isHidden = conteudoAnalise.classList.toggle('hidden');
        btnAnalise.innerHTML = isHidden ? '▶ Mostrar Análise Física' : '▼ Esconder Análise';
        if (!isHidden && window.MathJax) MathJax.typeset();
    };
};
