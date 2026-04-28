window.onload = function() {
    // 1. Lógica do Botão (Unificada)
    const btn = document.getElementById('btn-toggle');
    const conteudo = document.getElementById('conteudo-calculo');

    if (btn && conteudo) {
        btn.onclick = function() {
            // Alterna a classe hidden
            const estaEscondido = conteudo.classList.toggle('hidden');
            
            // Atualiza o texto do botão
            this.innerText = estaEscondido ? "▶ Mostrar Desenvolvimento Algébrico" : "▼ Esconder Desenvolvimento Algébrico";
            
            // Se a aba foi aberta, força o MathJax a renderizar as fórmulas
            if (!estaEscondido) {
                MathJax.typesetPromise([conteudo]).catch(function (err) {
                    console.log('Erro no MathJax: ' + err.message);
                });
            }
        };
    }

    // 2. Gráfico 3D (Distribuição Térmica)
    const x = [], y = [], z = [];
    for(let i=-6; i<=6; i+=0.4) x.push(i);
    for(let j=-5; j<=5; j+=0.4) y.push(j);

    for(let j=0; j<y.length; j++) {
        let row = [];
        for(let i=0; i<x.length; i++) {
            // Função: 150e^-0,1(x²+y²) + 40
            let val = 150 * Math.exp(-0.1 * (Math.pow(x[i], 2) + Math.pow(y[j], 2))) + 40;
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

    // 3. Gráfico 2D (Conceito de Elemento de Área dA)
    const cv = document.getElementById('meuGrafico2d');
    if (cv) {
        const ctx = cv.getContext('2d');
        const escala = 25; 
        const cx = cv.width/2; 
        const cy = cv.height/2;

        // Desenha o Domínio D (Chapa)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fillRect(cx - 5*escala, cy - 4*escala, 10*escala, 8*escala);
        
        // Eixos Cartesianos
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy);
        ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height);
        ctx.stroke();

        // Desenha o elemento dA (Diferencial)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2*escala, cy - 2*escala, 15, 15);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('dA', cx + 2*escala + 2, cy - 2*escala + 12);
    }
};
