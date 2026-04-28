window.onload = function() {
    // 1. Lógica do Botão (Unificada e Corrigida)
    const btn = document.getElementById('btn-toggle');
    const conteudo = document.getElementById('conteudo-calculo');

    if (btn && conteudo) {
        btn.onclick = function() {
            // Alterna a visibilidade (abre/fecha)
            const estaEscondido = conteudo.classList.toggle('hidden');
            
            // Atualiza o texto do botão conforme o estado
            this.innerText = estaEscondido ? "▶ Mostrar Desenvolvimento Algébrico" : "▼ Esconder Desenvolvimento Algébrico";
            
            // Linha crucial: Se a aba abrir, o MathJax redesenha as fórmulas
            if (!estaEscondido && window.MathJax) {
                MathJax.typesetPromise([conteudo]).catch(function (err) {
                    console.log('Erro ao renderizar MathJax: ' + err.message);
                });
            }
        };
    }

    // 2. Gráfico 3D (Distribuição de Calor)
    const x = [], y = [], z = [];
    for(let i=-6; i<=6; i+=0.4) x.push(i);
    for(let j=-5; j<=5; j+=0.4) y.push(j);

    for(let j=0; j<y.length; j++) {
        let row = [];
        for(let i=0; i<x.length; i++) {
            let val = 150 * Math.exp(-0.1 * (x[i]**2 + y[j]**2)) + 40;
            row.push(val);
        }
        z.push(row);
    }

    Plotly.newPlot('plot3d', [{
        z: z, x: x, y: y, type: 'surface', colorscale: 'Hot'
    }], {
        margin: {l:0, r:0, b:0, t:0},
        scene: { 
            xaxis: {title: 'X (cm)'}, 
            yaxis: {title: 'Y (cm)'}, 
            zaxis: {title: 'T (°C)'} 
        }
    });

    // 3. Gráfico 2D (Conceito de dA = dx * dy)
onst cv = document.getElementById('meuGrafico2d');
    if (cv) {
        const ctx = cv.getContext('2d');
        const escala = 25; // Ajuste de zoom (pixels por cm)
        const cx = cv.width / 2; // Centro X do canvas
        const cy = cv.height / 2; // Centro Y do canvas

        // Limpar canvas antes de desenhar
        ctx.clearRect(0, 0, cv.width, cv.height);

        // a. Desenha o Domínio Retangular (Chapa D)
        // Chapa vai de x[-5, 5] e y[-4, 4]
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)'; // Azul claro transparente
        ctx.strokeStyle = '#2980b9'; // Borda azul escura
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);

        // b. Eixos Cartesianos
        ctx.strokeStyle = '#ccc'; // Cinza claro
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); // Eixo X
        ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height); // Eixo Y
        ctx.stroke();

        // c. O PILAR DIFERENCIAL (dA = dx * dy) - IGUAL AO SLIDE
        // Escolhemos uma posição arbitrária na chapa para ilustrar: (x=2, y=2)
        const elX = cx + 2 * escala; 
        const elY = cy - 2 * escala;
        const tam = 15; // Tamanho do quadradinho dx por dy (em pixels)

        // Quadradinho vermelho destacado (o "pilar")
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(elX, elY, tam, tam);

        // d. Legendas e Linhas de Indicação
        ctx.strokeStyle = '#c0392b'; // Vermelho escuro
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Linha de indicação dx (abaixo do quadradinho)
        ctx.moveTo(elX, elY + tam + 5); 
        ctx.lineTo(elX + tam, elY + tam + 5);
        
        // Linha de indicação dy (à direita do quadradinho)
        ctx.moveTo(elX + tam + 5, elY); 
        ctx.lineTo(elX + tam + 5, elY + tam);
        ctx.stroke();

        // Textos dx, dy e dA
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('dx', elX + tam/4, elY + tam + 18); // Texto dx centralizado abaixo
        ctx.fillText('dy', elX + tam + 10, elY + tam/1.5); // Texto dy centralizado à direita
        ctx.fillText('dA', elX + 2, elY + tam - 3); // Texto dA dentro do quadradinho
    }
};
