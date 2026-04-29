window.onload = function() {
    // 1. CONFIGURAÇÃO DE INTERFACE (Botões e Abas)
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);
        
        if (btn && conteudo) {
            btn.onclick = function() {
                const visivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !visivel);
                
                // Atualiza ícone e texto
                const icone = visivel ? "▼" : "▶";
                const textoOriginal = this.innerText.replace(/[▶▼]\s*/, "");
                this.innerHTML = `<span class="icone">${icone}</span> ${textoOriginal}`;

                // Se abrir a aba, ajusta o gráfico 3D e renderiza fórmulas
                if (visivel) {
                    Plotly.Plots.resize('plot3d');
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    // 2. LÓGICA MATEMÁTICA
    const escala = 25;
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // 3. RENDERIZAÇÃO DOS GRÁFICOS 2D (Canvas)
    function renderizarCanvases() {
      
        // --- Gráfico de Corte: Perfil ---
        const cvCorte = document.getElementById('graficoCorte');
        if (cvCorte) {
            cvCorte.width = cvCorte.parentElement.clientWidth;
            cvCorte.height = 250;
            const ctx = cvCorte.getContext('2d');
            const cx = cvCorte.width / 2; const cy = cvCorte.height - 40;

            ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);
            
            ctx.strokeStyle = '#e67e22';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let x = -6; x <= 6; x += 0.1) {
                let px = cx + x * escala;
                let py = cy - (getTempAt(x, 0) * 0.7);
                if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
    }

    // 4. GRÁFICO 3D (Plotly)
    function renderizarPlotly() {
        const xV = [], yV = [], zV = [];
        for(let i=-6; i<=6; i+=0.4) xV.push(i);
        for(let j=-5; j<=5; j+=0.4) yV.push(j);
        
        for(let j=0; j<yV.length; j++) {
            let r = [];
            for(let i=0; i<xV.length; i++) r.push(getTempAt(xV[i], yV[j]));
            zV.push(r);
        }

        const data = [{
            z: zV, x: xV, y: yV, 
            type: 'surface', 
            colorscale: 'Hot',
            colorbar: { title: 'T (°C)', thickness: 15 }
        }];

        const layout = {
            margin: { l: 0, r: 0, b: 0, t: 0 },
            scene: {
                camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                zaxis: { title: 'T' }
            },
            autosize: true
        };

        Plotly.newPlot('plot3d', data, layout, {responsive: true});
    }

    // 5. INICIALIZAÇÃO IMEDIATA
    renderizarPlotly();
    renderizarCanvases();

    // 6. TRATAMENTO DE REDIMENSIONAMENTO (Resize)
    let resizeTimer;
    window.onresize = function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderizarCanvases();
            Plotly.Plots.resize('plot3d');
        }, 150);
    };
};
