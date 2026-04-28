window.onload = function() {
    // 1. Função Genérica para Controle de Abas
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
                    Plotly.Plots.resize('plot3d');
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    // 2. Lógica de Temperatura
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    // 3. Renderização do Gráfico 3D (Plotly)
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
    }], { 
        margin: {l:0, r:0, b:0, t:0},
        autosize: true 
    });

    // 4. Canvas 2D - Domínio D com dA (dx * dy)
    const escala = 25; 
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2; const cy = cv2d.height / 2;
        
        // Área total da chapa
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeStyle = '#2980b9';
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        
        // Elemento diferencial dA
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2 * escala, cy - 2 * escala, 15, 15);
        ctx.font = '10px Arial';
        ctx.fillText('dA (dx.dy)', cx + 2 * escala, cy - 2 * escala - 5);
    }

    // 5. Gráfico de Corte (Perfil em y=0)
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; 
        const cy = cvCorte.height - 50; 

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);
        
        // Desenho da Curva
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        for(let x = -6; x <= 6; x += 0.1) {
            let posX = cx + x * escala;
            let posY = cy - (getTempAt(x, 0) * 0.8); 
            if(x === -6) ctx.moveTo(posX, posY); else ctx.lineTo(posX, posY);
        }
        ctx.stroke();

        // Pilar diferencial dx
        const xPosSimulado = 2;
        const posX = cx + xPosSimulado * escala;
        const larguraDx = 15;
        const alturaPilar = getTempAt(xPosSimulado, 0) * 0.8;
        
        ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
        ctx.fillRect(posX, cy - alturaPilar, larguraDx, alturaPilar);
        ctx.fillStyle = '#333';
        ctx.fillText('dx', posX + 2, cy + 15);
    }
}; // Fim do window.onload
