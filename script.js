window.onload = function() {
    // 1. Controle de Abas Consolidado
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);
        if (btn && conteudo) {
            btn.onclick = function() {
                const visivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !visivel);
                
                // Ajusta ícone e redimensiona gráficos
                const icone = visivel ? "▼" : "▶";
                const texto = this.innerText.replace(/[▶▼]\s*/, "");
                this.innerHTML = `<span class="icone">${icone}</span> ${texto}`;

                if (visivel) {
                    Plotly.Plots.resize('plot3d');
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    const escala = 25;
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // 2. Gráfico 3D (Configurado para bater com a imagem)
    const xV = [], yV = [], zV = [];
    for(let i=-6; i<=6; i+=0.3) xV.push(i);
    for(let j=-5; j<=5; j+=0.3) yV.push(j);
    for(let j=0; j<yV.length; j++) {
        let r = [];
        for(let i=0; i<xV.length; i++) r.push(getTempAt(xV[i], yV[j]));
        zV.push(r);
    }

    Plotly.newPlot('plot3d', [{
        z: zV, x: xV, y: yV, 
        type: 'surface', 
        colorscale: 'Hot',
        colorbar: { thickness: 20, len: 0.8 } // Barra lateral de calor
    }], {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
            zaxis: { title: 'T' },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } } // Ângulo da foto
        }
    });

    // 3. Gráfico 2D - Domínio com dA
    const cv2d = document.getElementById('meuGrafico2d');
    if (cv2d) {
        const ctx = cv2d.getContext('2d');
        const cx = cv2d.width / 2; const cy = cv2d.height / 2;
        
        // Eixos
        ctx.strokeStyle = '#333';
        ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(cv2d.width-10, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, cv2d.height-10); ctx.stroke();

        // Elemento dA
        ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.fillRect(cx + 1.5*escala, cy - 2*escala, 18, 18);
        ctx.fillStyle = '#c0392b';
        ctx.font = '12px Arial';
        ctx.fillText('dA = dx.dy', cx + 1.5*escala - 10, cy - 2*escala - 10);
    }

    // 4. Gráfico de Corte
    const cvCorte = document.getElementById('graficoCorte');
    if (cvCorte) {
        const ctx = cvCorte.getContext('2d');
        const cx = cvCorte.width / 2; const cy = cvCorte.height - 40;

        ctx.strokeStyle = '#e67e22';
        ctx.beginPath();
        for(let x = -6; x <= 6; x += 0.1) {
            let px = cx + x * escala;
            let py = cy - (getTempAt(x, 0) * 0.7);
            if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
};
