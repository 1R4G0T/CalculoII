window.onload = function() {
    // === 1. SISTEMA DE INTERATIVIDADE E RENDERIZAÇÃO ===
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);

        if (btn && conteudo) {
            btn.onclick = function() {
                const estaVisivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !estaVisivel);
                
                const textoBase = this.innerText.replace(/[▶▼]\s*/, "");
                this.innerHTML = estaVisivel ? `▼ Esconder ${textoBase}` : `▶ Mostrar ${textoBase}`;
                
                if (estaVisivel) {
                    // Garante que o gráfico 3D se ajuste ao novo tamanho do container
                    Plotly.Plots.resize('plot3d');
                    // Força o reprocessamento do LaTeX no conteúdo revelado
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    // === 2. NÚCLEO MATEMÁTICO (Modelo Térmico) ===
    // Representa a função f(x,y) = 150 * exp(-0.1 * (x² + y²)) + 40
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (Math.pow(x, 2) + Math.pow(y, 2))) + 40;
    }

    // === 3. GRÁFICO 3D (Distribuição de Calor) ===
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
        z: zValues, x: xValues, y: yValues, 
        type: 'surface', 
        colorscale: 'Hot',
        colorbar: { title: 'T (°C)', thickness: 20 }
    }], { 
        scene: {
            xaxis: {title: 'X (cm)'},
            yaxis: {title: 'Y (cm)'},
            zaxis: {title: 'Temp (°C)'}
        },
        margin: {l:0, r:0, b:0, t:0},
        autosize: true 
    });

    // === 4. CANVAS 2D: DOMÍNIO D E DIFERENCIAL dA ===
    const escala = 25; 
    const cv2d = document.getElementById('meuGrafico2d');
    
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2; const cy = cv2d.height / 2;
        
        ctx.clearRect(0, 0, cv2d.width, cv2d.height);
        
        // Desenho dos Eixos Cartesianos
        ctx.strokeStyle = '#bbb';
        ctx.beginPath();
        ctx.moveTo(10, cy); ctx.lineTo(cv2d.width-10, cy); // Eixo X
        ctx.moveTo(cx, 10); ctx.lineTo(cx, cv2d.height-10); // Eixo Y
        ctx.stroke();

        // Domínio da Chapa (Retângulo -5 a 5 e -4 a 4)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.strokeStyle = '#2980b9';
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        
        // Ponto diferencial dA (x=2, y=2)
        const pX = 2 * escala; const pY = 2 * escala;
        ctx.setLineDash([5, 5]); // Linhas de projeção
        ctx.beginPath();
        ctx.moveTo(cx + pX, cy - pY); ctx.lineTo(cx + pX, cy);
        ctx.moveTo(cx + pX, cy - pY); ctx.lineTo(cx, cy - pY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + pX - 5, cy - pY - 5, 10, 10);
        ctx.fillText('dA (dx.dy)', cx + pX + 10, cy - pY);
    }

    // === 5. CANVAS 2D: CORTE TRANSVERSAL (Integração Iterada) ===
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; const cy = cvCorte.height - 50;

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);
        
        // Eixo de temperatura
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width - 20, cy);
        ctx.stroke();

        // Curva da Gaussiana em y=0
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        for(let x = -6; x <= 6; x += 0.1) {
            let posX = cx + x * escala;
            let posY = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(posX, posY); else ctx.lineTo(posX, posY);
        }
        ctx.stroke();

        // Representação do dx (Fatia diferencial)
        const pDx = cx + 2 * escala;
        const hT = getTempAt(2, 0) * 0.8;
        ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
        ctx.fillRect(pDx, cy - hT, 15, hT);
        ctx.fillStyle = '#333';
        ctx.fillText('dx', pDx + 2, cy + 15);
        ctx.fillText('T(x,0)', pDx - 10, cy - hT - 10);
    }
};
