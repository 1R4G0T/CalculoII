function gerarGrafico() {
    const xValues = [];
    const yValues = [];
    const zValues = [];

    // Gerar coordenadas x e y de -5 a 5 e -4 a 4
    for (let x = -5; x <= 5; x += 0.2) {
        xValues.push(x);
    }
    for (let y = -4; y <= 4; y += 0.2) {
        yValues.push(y);
    }

    // Calcular T(x,y) = 150 * e^(-0.1 * (x^2 + y^2)) + 40
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
        z: zValues,
        x: xValues,
        y: yValues,
        type: 'surface',
        colorscale: 'Hot',
        colorbar: { title: 'Temp °C' }
    }];

    const layout = {
        title: 'Distribuição Térmica na Chapa',
        autosize: true,
        scene: {
            xaxis: { title: 'X (cm)' },
            yaxis: { title: 'Y (cm)' },
            zaxis: { title: 'T (°C)' }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: '#2c3e50',
        font: { color: '#fff' }
    };

    Plotly.newPlot('plot3d', data, layout);
const canvas = document.getElementById('meuGrafico2d');
const ctx = canvas.getContext('2d');

function desenharGrafico() {
    const w = canvas.width;
    const h = canvas.height;
    const centroX = w / 2;
    const centroY = h / 2;
    const escala = 30; // 30 pixels = 1 cm

    // 1. Limpar fundo
    ctx.clearRect(0, 0, w, h);

    // 2. Desenhar a Região D (A chapa de alumínio)
    // x: -5 a 5 (10cm), y: -4 a 4 (8cm)
    ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    ctx.strokeStyle = '#3498db';
    ctx.setLineDash([5, 5]); // Linha tracejada para a chapa
    ctx.fillRect(centroX - 5 * escala, centroY - 4 * escala, 10 * escala, 8 * escala);
    ctx.strokeRect(centroX - 5 * escala, centroY - 4 * escala, 10 * escala, 8 * escala);

    // 3. Eixos cartesianos
    ctx.setLineDash([]);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centroY); ctx.lineTo(w, centroY); // Eixo X
    ctx.moveTo(centroX, 0); ctx.lineTo(centroX, h); // Eixo Y
    ctx.stroke();

    // 4. O ELEMENTO INFINITESIMAL (O "Cubinho" dx dy)
    const dx = 25; // tamanho visual do dx
    const dy = 25; // tamanho visual do dy
    const posX = centroX + 2 * escala; // Posição arbitrária para demonstração
    const posY = centroY - 2 * escala;

    ctx.fillStyle = '#e74c3c'; // Vermelho destaque
    ctx.globalAlpha = 0.8;
    ctx.fillRect(posX, posY, dx, dy);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(posX, posY, dx, dy);
    ctx.globalAlpha = 1.0;

    // 5. Rótulos e Letras
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    
    // Rótulos dx e dy
    ctx.fillText('dx', posX + dx/3, posY + dy + 18);
    ctx.fillText('dy', posX + dx + 5, posY + dy/1.5);
    
    // Rótulo dA
    ctx.font = 'italic bold 14px Arial';
    ctx.fillText('dA = dx·dy', posX - 15, posY - 10);

    // Nomes dos eixos e limites
    ctx.font = '12px Arial';
    ctx.fillText('x (cm)', w - 40, centroY + 15);
    ctx.fillText('y (cm)', centroX + 10, 20);
    ctx.fillText('-5', centroX - 5 * escala, centroY + 15);
    ctx.fillText('5', centroX + 5 * escala - 10, centroY + 15);
    ctx.fillText('4', centroX + 10, centroY - 4 * escala + 10);
    ctx.fillText('-4', centroX + 10, centroY + 4 * escala);
}

// Inicializa o gráfico quando a página carregar
window.onload = gerarGrafico;
// Executa o desenho
desenharGrafico();
