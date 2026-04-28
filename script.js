window.onload = function() {
    // 1. Função Genérica para Controle de Abas
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);

        if (btn && conteudo) {
            btn.onclick = function() {
                const estaVisivel = conteudo.classList.toggle('visible');
                conteudo.classList.toggle('hidden', !estaVisivel);
                
                const textoBase = this.innerText.replace(/[▶▼]\s*/, "");
                this.innerHTML = estaVisivel ? `▼ Esconder ${textoBase}` : `▶ Mostrar ${textoBase}`;
                
                if (estaVisivel) {
                    Plotly.Plots.resize('plot3d');
                    if (window.MathJax) MathJax.typesetPromise([conteudo]);
                }
            };
        }
    }

    configurarBotao('btn-toggle', 'conteudo-calculo');
    configurarBotao('btn-analise', 'conteudo-analise');

    // 2. Lógica de Temperatura
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

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
        z: zValues, x: xValues, y: yValues, type: 'surface', colorscale: 'Hot'
    }], { 
        margin: {l:0, r:0, b:0, t:0},
        autosize: true 
    });

    // === 3. Canvas 2D - Detalhamento Técnico ===
const escala = 25; 

// --- GRÁFICO 2D (Domínio da Chapa com Projeções) ---
const cv2d = document.getElementById('meuGrafico2d');
if (cv2d) {
    const ctx = cv2d.getContext('2d');
    const cx = cv2d.width / 2; const cy = cv2d.height / 2;
    
    // Configuração de texto padrão
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';

    ctx.clearRect(0, 0, cv2d.width, cv2d.height);

    // DESENHO DOS EIXOS (Faltava isso!)
    ctx.strokeStyle = '#bbb'; // Cinza claro para não poluir
    ctx.lineWidth = 1;
    
    // Eixo X (Abscissas)
    ctx.beginPath();
    ctx.moveTo(10, cy); ctx.lineTo(cv2d.width - 10, cy);
    ctx.stroke();
    ctx.fillText('x (cm)', cv2d.width - 45, cy + 15);

    // Eixo Y (Coordenadas)
    ctx.beginPath();
    ctx.moveTo(cx, 10); ctx.lineTo(cx, cv2d.height - 10);
    ctx.stroke();
    ctx.fillText('y (cm)', cx + 5, 20);

    // DESENHO DA CHAPA D
    ctx.fillStyle = 'rgba(52, 152, 219, 0.15)'; // Azul claro do domínio
    ctx.fillRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
    ctx.strokeStyle = '#2980b9'; // Borda azul
    ctx.strokeRect(cx - 5 * escala, cy - 4 * escala, 10 * escala, 8 * escala);
    
    // O PONTO DIFERENCIAL dA E PROJEÇÕES (O que "faltava")
    const pX = 2; const pY = 2; // Coordenadas simuladas do ponto
    const posX = cx + pX * escala;
    const posY = cy - pY * escala;

// Linhas de projeção pontilhadas
ctx.setLineDash([5, 5]); // Define o padrão tracejado: 5px linha, 5px espaço
ctx.strokeStyle = '#e74c3c';

// ... (seus códigos de ctx.stroke() para x e y)

ctx.setLineDash([]); // Reseta para linha sólida para não afetar o resto do desenho
    
    // Projeção para o eixo X
    ctx.beginPath();
    ctx.moveTo(posX, posY); ctx.lineTo(posX, cy);
    ctx.stroke();
    ctx.fillText(`x=${pX}`, posX - 10, cy + 12);

    // Projeção para o eixo Y
    ctx.beginPath();
    ctx.moveTo(posX, posY); ctx.lineTo(cx, posY);
    ctx.stroke();
    ctx.fillText(`y=${pY}`, cx - 35, posY + 4);

    ctx.setLineDash(); // Reseta tracejado

    // O ponto dA vermelho
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(posX - 4, posY - 4, 8, 8); // Centralizando o ponto
    ctx.font = '10px Arial';
    ctx.fillText('dA (dx.dy)', posX + 10, posY + 3);
}

// --- GRÁFICO DE CORTE (Perfil em y=0) ---
const cvCorte = document.getElementById('graficoCorte');
if (cvCorte) {
    const ctx = cvCorte.getContext('2d');
    const cx = cvCorte.width / 2; const cy = cvCorte.height - 50; 
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';

    ctx.clearRect(0, 0, cvCorte.width, cvCorte.height);

    // EIXO X (Abscissas)
    ctx.strokeStyle = '#333'; // Preto para o eixo principal
    ctx.beginPath();
    ctx.moveTo(20, cy); ctx.lineTo(cvCorte.width - 20, cy);
    ctx.stroke();
    ctx.fillText('x (cm)', cvCorte.width - 50, cy + 15);

    // EIXO T (Ordenadas - Escala visual)
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10); ctx.lineTo(cx, 10);
    ctx.stroke();
    ctx.fillText('T (°C)', cx - 40, 20);

    // DESENHO DA CURVA DE TEMPERATURA
    ctx.beginPath();
    ctx.strokeStyle = '#e67e22'; // Laranja da temperatura
    ctx.lineWidth = 2;
    for(let x = -6; x <= 6; x += 0.1) {
        let posX = cx + x * escala;
        let posY = cy - (getTempAt(x, 0) * 0.8); // 0.8 escala visual de altura
        if(x === -6) ctx.moveTo(posX, posY); else ctx.lineTo(posX, posY);
    }
    ctx.stroke();

    // O PILAR DIFERENCIAL dx E PROJEÇÃO (Resolvendo o "faltou algo")
    const xPosDx = 2;
    const pDxX = cx + xPosDx * escala;
    const alturaT = getTempAt(xPosDx, 0) * 0.8;
    
    // Pilar preenchido com transparência
    ctx.fillStyle = 'rgba(231, 76, 60, 0.6)';
    ctx.fillRect(pDxX, cy - alturaT, 15, alturaT);
    
// Linha pontilhada indicando dx no chão
ctx.setLineDash([3, 3]); 
ctx.strokeStyle = '#e74c3c';
ctx.beginPath();
ctx.moveTo(pDxX + 15, cy - alturaT); 
ctx.lineTo(pDxX + 15, cy);
ctx.stroke();
ctx.setLineDash([]); // Sempre resetar após o uso
    // Textos
    ctx.fillStyle = '#333';
    ctx.fillText('dx', pDxX + 2, cy + 15);
    ctx.fillText('T(x,0)', pDxX - 10, cy - alturaT - 10);
}
