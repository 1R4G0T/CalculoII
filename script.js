window.onload = function() {
    // === 1. SISTEMA DE INTERATIVIDADE (ABAS) ===
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);

        if (btn && conteudo) {
            btn.onclick = function() {
                // Alterna as classes de visibilidade
                const estaVisivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !estaVisivel);
                
                // Atualiza o ícone e o texto do botão conforme o estado
                const textoBase = this.innerText.replace(/[▶▼]\s*/, "");
                this.innerHTML = estaVisivel ? `▼ Esconder ${textoBase}` : `▶ Mostrar ${textoBase}`;
                
                if (estaVisivel) {
                    // Ajusta o gráfico 3D para o novo tamanho do container
                    Plotly.Plots.resize('plot3d');
                    // Renderiza as fórmulas matemáticas (LaTeX) no conteúdo revelado
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    // Inicializa os botões do Memorial e da Análise Física
    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    // === 2. NÚCLEO MATEMÁTICO (MODELO TÉRMICO) ===
    // Função f(x,y) = 150 * exp(-0.1 * (x² + y²)) + 40
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // === 3. GRÁFICO 3D (DISTRIBUIÇÃO DE CALOR) ===
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

    const data3d = [{
        z: zValues, x: xValues, y: yValues, 
        type: 'surface', 
        colorscale: 'Hot',
        colorbar: { title: 'T (°C)', thickness: 20 }
    }];

    const layout3d = { 
        margin: {l:0, r:0, b:0, t:0},
        autosize: true,
        scene: {
            xaxis: {title: 'X (cm)'},
            yaxis: {title: 'Y (cm)'},
            zaxis: {title: 'Temp (°C)'}
        }
    };

    // Renderiza o gráfico e REMOVE a barra de ferramentas de baixo (modebar)
    Plotly.newPlot('plot3d', data3d, layout3d, { displayModeBar: false });

    // === 4. CANVAS 2D: DOMÍNIO D E dA ===
    const escala = 25; 
    const cv2d = document.getElementById('meuGrafico2d');
    
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2; const cy = cv2d.height / 2;
        
        // Fundo do Domínio (Retângulo Azul Claro)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeStyle = '#2980b9';
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        
        // Elemento diferencial dA (Ponto de Integração)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2 * escala, cy - 2 * escala, 12, 12);
        ctx.font = '11px Arial';
        ctx.fillText('dA = dx.dy', cx + 2 * escala, cy - 2 * escala - 5);
    }

    // === 5. CANVAS 2D: CORTE TRANSVERSAL (y=0) ===
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; const cy = cvCorte.height - 50;

        ctx.beginPath();
        ctx.strokeStyle = '#e67e22'; // Cor laranja para a curva térmica
        ctx.lineWidth = 2.5;
        
        for(let x = -6; x <= 6; x += 0.1) {
            let posX = cx + x * escala;
            let posY = cy - (getTempAt(x, 0) * 0.8);
            if(x === -6) ctx.moveTo(posX, posY); else ctx.lineTo(posX, posY);
        }
        ctx.stroke();

        // Indicação do diferencial dx
        ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
        const pDx = cx + 2 * escala;
        const hT = getTempAt(2, 0) * 0.8;
        ctx.fillRect(pDx, cy - hT, 15, hT);
        ctx.fillStyle = '#333';
        ctx.fillText('dx', pDx + 2, cy + 15);
    }
};
