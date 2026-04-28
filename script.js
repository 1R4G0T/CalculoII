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

// Executa o desenho
desenharGrafico();
