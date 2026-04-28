window.onload = function() {
    // 1. Lógica do Botão e Abas
    const btn = document.getElementById('btn-toggle');
    const conteudo = document.getElementById('conteudo-calculo');

    if (btn && conteudo) {
        btn.onclick = function() {
            const estaVisivel = conteudo.classList.toggle('visible');
            conteudo.classList.toggle('hidden', !estaVisivel);
            
            this.innerHTML = estaVisivel ? "▼ Esconder Desenvolvimento Algébrico" : "▶ Mostrar Desenvolvimento Algébrico";
            
            if (estaVisivel) {
                // Força o gráfico 3D a ocupar o espaço novo
                Plotly.Plots.resize('plot3d');
                // Renderiza as fórmulas matemáticas
                if (window.MathJax) MathJax.typesetPromise([conteudo]);
            }
        };
    }

    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    // 2. Gráfico 3D
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

    // 3. Canvas 2D
    const escala = 25; 

    // Domínio D
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2; const cy = cv2d.height / 2;
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeStyle = '#2980b9';
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2 * escala, cy - 2 * escala, 15, 15);
    }

    // --- GRÁFICO DE CORTE (Perfil Lateral em y=0) ---
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; 
        const cy = cvCorte.height - 50; 

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);

        // 1. Eixo X (Chão do gráfico)
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width - 20, cy);
        ctx.stroke();

        // 2. Desenha a Curva de Temperatura
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        for(let x = -6; x <= 6; x += 0.1) {
            let posX = cx + x * escala;
            let posY = cy - (getTempAt(x, 0) * 0.8); 
            if(x === -6) ctx.moveTo(posX, posY); else ctx.lineTo(posX, posY);
        }
        ctx.stroke();

        // 3. O PILAR DIFERENCIAL (Representando dx)
        // Definimos o pilar em x = 2 para coincidir com o gráfico 2D
        const xPosSimulado = 2;
        const posX = cx + xPosSimulado * escala;
        const larguraDx = 15; // Largura visual do dx
        const alturaPilar = getTempAt(xPosSimulado, 0) * 0.8;
        
        // Desenha o preenchimento do pilar
        ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
        ctx.fillRect(posX, cy - alturaPilar, larguraDx, alturaPilar);
        
        // Adiciona os textos indicativos
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('T(x,0)', posX - 10, cy - alturaPilar - 10);
        ctx.fillText('dx', posX + 2, cy + 15);
    }
