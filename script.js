window.onload = function() {
    // === 1. Função Matemática Base ===
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    const escala = 25; // Constante de escala para os desenhos 2D

    // === 2. Lógica dos Botões (Abas Retráteis) ===
    
    // Aba do Memorial de Cálculo
    const btnCalc = document.getElementById('btn-toggle');
    const conteudoCalc = document.getElementById('conteudo-calculo');

    if (btnCalc && conteudoCalc) {
        btnCalc.onclick = function() {
            const estaEscondido = conteudoCalc.classList.toggle('hidden');
            this.innerText = estaEscondido ? "▶ Mostrar Desenvolvimento Algébrico" : "▼ Esconder Desenvolvimento Algébrico";
            if (!estaEscondido && window.MathJax) MathJax.typesetPromise([conteudoCalc]);
        };
    }

    // Aba de Análise Física
    const btnAnalise = document.getElementById('btn-analise');
    const conteudoAnalise = document.getElementById('conteudo-analise');

    if (btnAnalise && conteudoAnalise) {
        btnAnalise.onclick = function() {
            const estaEscondido = conteudoAnalise.classList.toggle('hidden');
            this.innerText = estaEscondido ? "▶ Mostrar Análise e Interpretação Física" : "▼ Esconder Análise e Interpretação Física";
            if (!estaEscondido && window.MathJax) MathJax.typesetPromise([conteudoAnalise]);
        };
    }

    // === 3. Renderização do Gráfico 3D (Plotly) ===
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

    const plot3d = document.getElementById('plot3d');
    if (plot3d) {
        Plotly.newPlot('plot3d', [{
            z: zValues, x: xValues, y: yValues, type: 'surface', colorscale: 'Hot'
        }], { 
            margin: {l:0, r:0, b:0, t:0},
            scene: {
                xaxis: {title: 'X (cm)'},
                yaxis: {title: 'Y (cm)'},
                zaxis: {title: 'T (°C)'}
            }
        });
    }

    // === 4. Gráfico 2D (Domínio da Chapa) ===
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2;
        const cy = cv2d.height / 2;

        ctx.clearRect(0, 0, cv2d.width, cv2d.height);
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(cv2d.width, cy);
        ctx.moveTo(cx, 0); ctx.lineTo(cx, cv2d.height);
        ctx.stroke();

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2 * escala, cy - 2 * escala, 15, 15);
        ctx.fillText('dA', cx + 2 * escala + 2, cy - 2 * escala + 12);
    }

    // === 5. Gráfico de Corte Lateral (Perfil) ===
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2;
        const cy = cvCorte.height - 50;

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width - 20, cy);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        for(let x = -6; x <= 6; x += 0.1) {
            let posX = cx + x * escala;
            let posY = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(posX, posY);
            else ctx.lineTo(posX, posY);
        }
        ctx.stroke();

        const posX = cx + 2 * escala;
        const alturaPilar = getTempAt(2, 0) * 0.8;
        ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.fillRect(posX, cy - alturaPilar, 15, alturaPilar);
        
        ctx.fillStyle = '#333';
        ctx.fillText('T(x,0)', posX - 10, cy - alturaPilar - 10);
        ctx.fillText('dx', posX + 2, cy + 15);
    }
};
