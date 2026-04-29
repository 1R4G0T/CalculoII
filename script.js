window.onload = function() {
    const btn = document.getElementById('btn-toggle');
    const conteudo = document.getElementById('conteudo-calculo');

    // 1. Lógica das Abas
    if (btn && conteudo) {
        btn.onclick = function() {
            const escondido = conteudo.classList.toggle('hidden');
            this.innerHTML = escondido ? "▶ Mostrar Desenvolvimento Algébrico" : "▼ Esconder Desenvolvimento Algébrico";
            
            // Força o Plotly a se ajustar ao novo tamanho da tela
            if (!escondido) {
                Plotly.Plots.resize('plot3d');
                if (window.MathJax) MathJax.typesetPromise([conteudo]);
            }
        };
    }

    // 2. Função de Temperatura
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    // 3. Gráfico 3D (Plotly)
    const xValues = [], yValues = [], zValues = [];
    for(let i=-6; i<=6; i+=0.4) xValues.push(i);
    for(let j=-5; j<=5; j+=0.4) yValues.push(j);

    for(let j=0; j<yValues.length; j++) {
        let row = [];
        for(let i=0; i<xValues.length; i++) {
            row.push(getTempAt(xValues[i], yValues[j]));
        }
        zValues.push(row);
    }

    Plotly.newPlot('plot3d', [{
        z: zValues, x: xValues, y: yValues, type: 'surface', colorscale: 'Hot'
    }], { margin: {l:0, r:0, b:0, t:0}, autosize: true });

    // 4. Desenho nos Canvas (2D e Corte)
    const escala = 25;
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width/2; const cy = cv2d.height/2;
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fillRect(cx - 5*escala, cy - 4*escala, 10*escala, 8*escala);
    }

    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width/2; const cy = cvCorte.height - 50;
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        for(let x=-6; x<=6; x+=0.1) {
            let px = cx + x*escala;
            let py = cy - (getTempAt(x,0)*0.8);
            if(x===-6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
};
