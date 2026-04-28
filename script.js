window.onload = function() {
    // 1. Função de Distribuição de Temperatura
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    const escala = 25; 

    // 2. Lógica das Abas (Mostrar/Esconder)
    const configurarAba = (idBtn, idConteudo, texto) => {
        const btn = document.getElementById(idBtn);
        const conteudo = document.getElementById(idConteudo);
        if (btn && conteudo) {
            btn.onclick = function() {
                const escondido = conteudo.classList.toggle('hidden');
                this.innerText = escondido ? "▶ " + texto : "▼ Esconder " + texto;
                
                // Força o MathJax a renderizar as fórmulas se a aba abrir
                if (!escondido && window.MathJax) {
                    MathJax.typesetPromise([conteudo]);
                }
                
                // Se abrir a aba de cálculo, redimensiona o gráfico 3D para evitar bugs
                if (!escondido) Plotly.Plots.resize('plot3d');
            };
        }
    };

    configurarAba('btn-toggle', 'conteudo-calculo', 'Desenvolvimento Algébrico');
    configurarAba('btn-analise', 'conteudo-analise', 'Análise e Interpretação Física');

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
        z: zValues, x: xValues, y: yValues, 
        type: 'surface', 
        colorscale: 'Hot'
    }], { 
        margin: {l:0, r:0, b:0, t:0},
        scene: { camera: { eye: {x: 1.5, y: 1.5, z: 1.2} } }
    });

    // 4. Gráfico 2D (Domínio da Chapa no Canvas)
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2;
        const cy = cv2d.height / 2;
        
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        ctx.strokeStyle = '#2980b9';
        ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
        
        // Elemento diferencial dA
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cx + 2 * escala, cy - 2 * escala, 15, 15);
    }

    // 5. Gráfico de Corte (Perfil Gaussiano)
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2;
        const cy = cvCorte.height - 50;
        
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
    }
};
