window.onload = function() {
    // 1. Lógica do Botão (Unificada e Corrigida)
    const btn = document.getElementById('btn-toggle');
    const conteudo = document.getElementById('conteudo-calculo');

    if (btn && conteudo) {
        btn.onclick = function() {
            const estaEscondido = conteudo.classList.toggle('hidden');
            this.innerText = estaEscondido ? "▶ Mostrar Desenvolvimento Algébrico" : "▼ Esconder Desenvolvimento Algébrico";
            
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

    // 3. Gráfico 2D (Corrigido: era aqui o erro 'onst')
    const cv = document.getElementById('meuGrafico2d');
    if (cv) {
        const ctx = cv.getContext('2d');
        const escala = 25; 
        const cx = cv.width / 2; 
        const cy = cv.height / 2; 

        ctx.clearRect(0, 0, cv.width, cv.height);

        // a. Desenha o Domínio Retangular (Chapa D)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)'; 
        ctx.strokeStyle = '#2980b9'; 
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);

        // b. Eixos Cartesianos
        ctx.strokeStyle = '#ccc'; 
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy); 
        ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height); 
        ctx.stroke();

        // c. O PILAR DIFERENCIAL (dA = dx * dy)
        const elX = cx + 2 * escala; 
        const elY = cy - 2 * escala;
        const tam = 15; 

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(elX, elY, tam, tam);

        // d. Legendas e Linhas de Indicação
        ctx.strokeStyle = '#c0392b'; 
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(elX, elY + tam + 5); 
        ctx.lineTo(elX + tam, elY + tam + 5);
        ctx.moveTo(elX + tam + 5, elY); 
        ctx.lineTo(elX + tam + 5, elY + tam);
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('dx', elX + tam/4, elY + tam + 18);
        ctx.fillText('dy', elX + tam + 10, elY + tam/1.5);
        ctx.fillText('dA', elX + 2, elY + tam - 3);

        const cvCorte = document.getElementById('graficoCorte');
if (cvCorte) {
    const ctx = cvCorte.getContext('2d');
    // Desenha a curva 150 * exp(-0.1 * x^2) + 40
    ctx.beginPath();
    ctx.strokeStyle = '#e67e22'; // Laranja
    for(let x = -6; x <= 6; x += 0.1) {
        let posX = cx + x * escala;
        let posY = cy - (150 * Math.exp(-0.1 * (x**2)) + 40) * 0.5; // Escala de altura
        if(x === -6) ctx.moveTo(posX, posY);
        else ctx.lineTo(posX, posY);
    }
    ctx.stroke();

    // Desenha o PILAR lateral (um retângulo de base dx)
    ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
    ctx.fillRect(cx + 2 * escala, cy - (getTempAt(2,0) * 0.5), 15, (getTempAt(2,0) * 0.5));
}
    }
};
