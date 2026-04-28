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
function desenharGrafico2D() {
    const cv = document.getElementById('meuGrafico2d');
    const ctx = cv.getContext('2d');
    const escala = 20; // Ajuste de zoom
    const cx = cv.width / 2;
    const cy = cv.height / 2;

    // Limpar canvas
    ctx.clearRect(0, 0, cv.width, cv.height);

    // 1. Desenha a Chapa D (Retângulo principal)
    ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    // Chapa vai de x[-5, 5] e y[-4, 4]
    ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
    ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);

    // 2. Desenha o Elemento de Área dA (Igual ao slide)
    const elX = cx + 2 * escala; // Posição arbitrária para ilustrar
    const elY = cy - 2 * escala;
    const tam = 0.8 * escala;

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(elX, elY, tam, tam);

    // Linhas de indicação dx e dy
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // dx (base)
    ctx.moveTo(elX, elY + tam + 5); ctx.lineTo(elX + tam, elY + tam + 5);
    // dy (altura)
    ctx.moveTo(elX + tam + 5, elY); ctx.lineTo(elX + tam + 5, elY + tam);
    ctx.stroke();

    // Textos dA, dx, dy
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('dA', elX + 2, elY + tam - 5);
    ctx.fillText('dx', elX + tam/4, elY + tam + 18);
    ctx.fillText('dy', elX + tam + 10, elY + tam/1.5);

    // 3. Eixos Cartesianos
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); // Eixo X
    ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height); // Eixo Y
    ctx.stroke();
    
    ctx.fillText('X', cv.width - 15, cy - 5);
    ctx.fillText('Y', cx + 5, 15);
}

        // Elemento diferencial dA (igual ao slide da aula)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2*escala, cy - 2*escala, 15, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('dA', cx + 2*escala + 2, cy - 2*escala + 12);
    }
};
