window.onload = function() {
    // === 1. CONFIGURAÇÃO DE ABAS E INTERFACE ===
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);
        
        if (btn && conteudo) {
            btn.onclick = function() {
                const visivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !visivel);
                
                // Atualiza o texto e o ícone do botão
                const acao = visivel ? "Esconder" : "Mostrar";
                const icone = visivel ? "▼" : "▶";
                const textoOriginal = this.innerText.replace(/[▶▼]\s*(Mostrar|Esconder)\s*/, "");
                this.innerHTML = `<span class="icone">${icone}</span> ${acao} ${textoOriginal}`;

                // Recalcula o layout se necessário
                if (visivel) {
                    Plotly.Plots.resize('plot3d');
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    // === 2. CONSTANTES MATEMÁTICAS ===
    const escala = 25;
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;

    // === 3. RENDERIZAÇÃO DOS GRÁFICOS (CANVAS 2D) ===
    function renderizarDesenhos2D() {

        // --- Perfil de Corte (Corte em Y=0) ---
        const cvCorte = document.getElementById('graficoCorte');
        if (cvCorte) {
            cvCorte.width = cvCorte.parentElement.clientWidth - 40;
            cvCorte.height = 250;
            const ctx = cvCorte.getContext('2d');
            const cx = cvCorte.width / 2; const cy = cvCorte.height - 40;

            ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);
            
            ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 3;
            ctx.beginPath();
            for(let x = -6; x <= 6; x += 0.1) {
                let px = cx + x * escala;
                let py = cy - (getTempAt(x, 0) * 0.8);
                if(x === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.fillStyle = '#333';
            ctx.fillText('Perfil de Temperatura T(x,0)', 10, 20);
        }
    }

    // === 4. GRÁFICO 3D (PLOTLY) ===
    function renderizarPlotly() {
        const xV = [], yV = [], zV = [];
        for(let i=-6; i<=6; i+=0.4) xV.push(i);
        for(let j=-5; j<=5; j+=0.4) yV.push(j);
        for(let j=0; j<yV.length; j++) {
            let row = [];
