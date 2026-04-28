window.onload = function() {
    // === 1. Função Matemática Base ===
    function getTempAt(x, y) {
        // Função gaussiana com patamar basal
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    const escala2d = 25; // Escala para os canvas 2D

    // === 2. Lógica das Abas (Blindada com CSS Class Toggle) ===
    
    // Função genérica para configurar abas
    const configurarAba = (idBtn, idConteudo, texto) => {
        const btn = document.getElementById(idBtn);
        const conteudo = document.getElementById(idConteudo);
        const icone = btn.querySelector('.icone');

        if (btn && conteudo) {
            btn.onclick = function() {
                // Alterna entre a classe 'hidden' e 'visible' do CSS
                const estaVisivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !estaVisivel);
                
                // Atualiza o texto e a rotação do ícone
                this.childNodes[1].nodeValue = estaVisivel ? " Esconder " + texto : " " + texto;
                icone.style.transform = estaVisivel ? 'rotate(90deg)' : 'rotate(0deg)';
                
                // Força o MathJax a re-processar as fórmulas ao abrir a aba
                if (estaVisivel && window.MathJax) {
                    MathJax.typesetPromise();
                }
                
                // CRUCIAL: Força o Plotly a redimensionar quando a aba abre, 
                // resolvendo o bug do gráfico esmagado
                if (estaVisivel) {
                    Plotly.Plots.resize('plot3d');
                }
            };
        }
    };

    // Ativando as duas abas
    configurarAba('btn-toggle', 'conteudo-calculo', 'Desenvolvimento Algébrico');
    configurarAba('btn-analise', 'conteudo-analise', 'Análise e Interpretação Física');


    // === 3. Renderização dos Gráficos ===

    // --- GRÁFICO 3D (Plotly) ---
    const xValues = [], yValues = [], zValues = [];
    // Gerando malha de pontos
    for(let i=-6; i<=6; i+=0.3) xValues.push(i);
    for(let j=-5; j<=5; j+=0.3) yValues.push(j);

    // Calculando a matriz Z
    for(let j=0; j<yValues.length; j++) {
        let row = [];
        for(let i=0; i<xValues.length; i++) {
            row.push(getTempAt(xValues[i], yValues[j]));
        }
        zValues.push(row);
    }

    const plot3dDiv = document.getElementById('plot3d');
    if (plot3dDiv) {
        Plotly.newPlot('plot3d',, {
            margin: {l:0, r:0, b:0, t:0},
            scene: {
                xaxis: {title: 'X (cm)'},
                yaxis: {title: 'Y (cm)'},
                zaxis: {title: 'T (°C)'}
            },
            autosize: true
        });
    }

    // --- GRÁFICO 2D (Domínio da Chapa) ---
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2;
        const cy = cv2d.height / 2;

        ctx.clearRect(0, 0, cv2d.width, cv2d.height);
        
        // Desenho da Chapa D (Retângulo azul claro)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(cx - 5 * escala2d, cy - 4 * escala2d, 10 * escala2d, 8 * escala2d);
        
        // Borda da chapa
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 5 * escala2d, cy - 4 * escala2d, 10 * escala2d, 8 * escala2d);

        // Eixos Cartesianos
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(cv2d.width, cy); // Eixo X
        ctx.moveTo(cx, 0); ctx.lineTo(cx, cv2d.height); // Eixo Y
        ctx.stroke();

        // Pilar dA (Elemento diferencial em vermelho)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2 * escala2d, cy - 2 * escala2d, 15, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('dA', cx + 2 * escala2d + 2, cy - 2 * escala2d + 12);
    }

    // --- GRÁFICO DE CORTE (Perfil Lateral em y=0) ---
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2;
        const cy = cvCorte.height - 50; // Chão do gráfico

        ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);

        // Eixo X (Chão)
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width - 20, cy);
        ctx.stroke();

        // Desenha a Curva de Temperatura (Perfil Gaussiano)
        ctx.beginPath();
        ctx.strokeStyle = '#e67e22'; // Laranja
        ctx.lineWidth = 2;
        for(let x = -6; x <= 6; x += 0.1) {
            let posX = cx + x * escala2d;
            // Temperatura em y=0. 0.8 é escala visual de altura.
            let posY = cy - (getTempAt(x, 0) * 0.8); 
            if(x === -6) ctx.moveTo(posX, posY);
            else ctx.lineTo(posX, posY);
        }
        ctx.stroke();

        // Legendas básicas
        ctx.fillStyle = '#333';
        ctx.fillText('x = 2cm', cx + 2 * escala2d - 15, cy + 15);
    }
};
