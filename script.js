// Função para abrir e fechar o passo a passo
function toggleCalculo() {
    const conteudo = document.getElementById('conteudo-passo-a-passo');
    const botao = document.querySelector('.botao-aba');
    
    if (conteudo.style.display === "block") {
        conteudo.style.display = "none";
        botao.innerText = "▶ Mostrar Passo a Passo do Cálculo";
    } else {
        conteudo.style.display = "block";
        botao.innerText = "▼ Esconder Passo a Passo";
    }
}

// Desenho do Gráfico Didático
const canvas = document.getElementById('meuGrafico2d');
const ctx = canvas.getContext('2d');

function desenharCena() {
    const w = canvas.width;
    const h = canvas.height;
    const cX = w / 2;
    const cY = h / 2;
    const esc = 30;

    ctx.clearRect(0, 0, w, h);

    // Chapa
    ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    ctx.fillRect(cX - 5*esc, cY - 4*esc, 10*esc, 8*esc);
    ctx.strokeStyle = '#3498db';
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cX - 5*esc, cY - 4*esc, 10*esc, 8*esc);

    // Eixos
    ctx.setLineDash([]);
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(0, cY); ctx.lineTo(w, cY);
    ctx.moveTo(cX, 0); ctx.lineTo(cX, h);
    ctx.stroke();

    // Elemento dA (O Cubinho)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(cX + 2*esc, cY - 2*esc, 25, 25);
    
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText('dy', cX + 2*esc + 30, cY - 2*esc + 15);
    ctx.fillText('dx', cX + 2*esc + 5, cY - 2*esc + 40);
    ctx.fillText('dA = dx.dy', cX + 2*esc - 10, cY - 2*esc - 10);
}

desenharCena();
