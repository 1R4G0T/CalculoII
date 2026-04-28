document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. FUNÇÃO DO BOTÃO (CORRIGIDA) ---
    // Defini a função como global para o onclick no HTML funcionar
    window.toggleCalculo = function() {
        const conteudo = document.getElementById('conteudo-calculo');
        const botao = document.getElementById('btn-toggle-calculo');
        
        if (conteudo.classList.contains('escondido')) {
            // Se estiver escondido, mostra
            conteudo.classList.remove('escondido');
            botao.innerText = "▼ Esconder Passo a Passo";
        } else {
            // Se estiver à mostra, esconde
            conteudo.classList.add('escondido');
            botao.innerText = "▶ Mostrar Passo a Passo do Cálculo";
        }
    }

    // --- 2. GRÁFICO 1: DISTRIBUIÇÃO 3D (Plotly) ---
    function gerarGrafico3D() {
        const xValues = [];
        const yValues = [];
        const zValues = [];

        // Gerar coordenadas x e y
        for (let x = -6; x <= 6; x += 0.3) xValues.push(x);
        for (let y = -5; y <= 5; y += 0.3) yValues.push(y);

        // Calcular T(x,y)
        for (let i = 0; i < yValues.length; i++) {
            const row = [];
            for (let j = 0; j < xValues.length; j++) {
                const x = xValues[j];
                const y = yValues[i];
                const t = 150 * Math.exp(-0.1 * (Math.pow(x, 2) + Math.pow(y, 2))) + 40;
                row.push(t);
            }
            zValues.push(row);
        }

        const data = [{
            z: zValues, x: xValues, y: yValues,
            type: 'surface',
            colorscale: 'Hot',
            colorbar: { title: 'T °C' }
        }];

        const layout = {
            scene: { xaxis: {title: 'X (cm)'}, yaxis: {title: 'Y (cm)'}, zaxis: {title: 'T (°C)'} },
            margin: { l: 0, r: 0, b: 0, t: 0 },
            paper_bgcolor: '#ffffff',
            font: { color: '#333' },
            camera: { eye: {x: 1.5, y: 1.5, z: 1.2} }
        };

        Plotly.newPlot('plot3d', data, layout);
    }

    // --- 3. GRÁFICO 2: DOMÍNIO 2D (Canvas) ---
    const canvas = document.getElementById('meuGrafico2d');
    const ctx = canvas.getContext('2d');

    function desenharGrafico2D() {
        const w = canvas.width;
        const h = canvas.height;
        const cX = w / 2;
        const cY = h / 2;
        const esc = 25;

        ctx.clearRect(0, 0, w, h);

        // Chapa (Região D)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
        ctx.fillRect(cX - 5*esc, cY - 4*esc, 10*esc, 8*esc);
        ctx.strokeStyle = '#3498db';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(cX - 5*esc, cY - 4*esc, 10*esc, 8*esc);

        // Eixos
        ctx.setLineDash([]);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, cY); ctx.lineTo(w, cY);
        ctx.moveTo(cX, 0); ctx.lineTo(cX, h);
        ctx.stroke();

        // Elemento dA (Vermelho)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cX + 1.5*esc, cY - 2.5*esc, 25, 25);
        
        ctx.fillStyle = '#000';
        ctx.font = '11px Arial';
        ctx.fillText('dy', cX + 1.5*esc + 30, cY - 2.5*esc + 15);
        ctx.fillText('dx', cX + 1.5*esc + 5, cY - 2.5*esc + 40);
        
        ctx.fillStyle = '#666';
        ctx.fillText('x', w-12, cY+12);
        ctx.fillText('y', cX+6, 12);
    }

     // --- 4. VISUALIZAÇÃO 3: DIAGRAMA DIDÁTICO DE dA (Substituto do dx/dy em volume) ---
    // Como criar um gráfico interativo de um único volume é pesado,
    // vamos usar um diagrama diagramático simples para a explicação.
    function gerarDiagramadA() {
        const diagramDiv = document.getElementById('diagrama-da-3d');
        diagramDiv.innerHTML = `
            <div style="text-align: center; font-size: 0.9rem; padding: 20px;">
                <p><strong>Conceito de Volume:</strong></p>
                <div style="display:inline-block; border: 2px solid #e74c3c; background:rgba(231, 76, 60, 0.1); width:60px; height:60px; position:relative;">
                    <div style="position:absolute; bottom:-18px; left:20px;">dx</div>
                    <div style="position:absolute; right:-18px; top:20px;">dy</div>
                </div>
                <div style="margin: 10px 0;">+</div>
                <div style="display:inline-block; border-left: 2px solid #333; height: 50px;"></div> 
                <div style="font-size:1.1rem; margin-top:-5px;">T(x,y)</div>
                <div style="margin: 10px 0;">=</div>
                <div style="font-size: 1.2rem; border: 2px solid #27ae60; color:#27ae60; padding: 5px; display:inline-block;">Elemento de Volume</div>
            </div>
        `;
    }

    // --- INICIALIZAÇÃO ---
    gerarGrafico3D();
    desenharGrafico2D();
    gerarDiagramadA();
});
