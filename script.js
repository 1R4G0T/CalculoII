window.onload = function() {
    // 1. CONFIGURAÇÃO DOS BOTÕES (TOGGLES)
    const toggle = (idBtn, idCont) => {
        const b = document.getElementById(idBtn);
        const c = document.getElementById(idCont);
        if(b && c) {
            b.onclick = () => {
                c.classList.toggle('hidden');
                const isHidden = c.classList.contains('hidden');
                // Atualiza o ícone do botão
                b.innerHTML = (isHidden ? "▶ " : "▼ ") + b.innerText.substring(2);
                // Renderiza o MathJax novamente para garantir as fórmulas no conteúdo revelado
                if (!isHidden && window.MathJax) {
                    MathJax.typesetPromise();
                }
            };
        }
    };

    toggle('btn-toggle', 'conteudo-calculo');
    toggle('btn-analise', 'conteudo-analise');

    // 2. GRÁFICO DE CORTE LATERAL (2D CANVAS - Y = 0)
    const canvas = document.getElementById('graficoCorte');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 440; 
        canvas.height = 220;
        
        const cx = 220; // Centro do eixo X
        const cy = 180; // Base do gráfico (onde T=0 teoricamente, mas aqui é o suporte visual)
        const escalaX = 35; // px por cm
        const escalaT = 0.7; // px por °C

        // Desenho dos Eixos (Pretos)
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(420, cy); // Eixo X
        ctx.moveTo(cx, 20); ctx.lineTo(cx, cy + 20); // Eixo T
        ctx.stroke();

        // DESENHO DO PILAR dA (Encostando na Curva)
        const xAmostra = 1.5; // Posição do pilar em x
        // T(x,0) = 150 * e^(-0.1 * x²) + 40
        const tempNoPonto = 150 * Math.exp(-0.1 * Math.pow(xAmostra, 2)) + 40; 
        
        const larguraPilar = 25;
        const alturaPilarPx = tempNoPonto * escalaT;
        const pxPilar = cx + (xAmostra * escalaX);
        const pyPilar = cy - alturaPilarPx;

        ctx.fillStyle = "rgba(255, 0, 0, 0.4)"; // Vermelho transparente
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        // Desenha do eixo X até o topo da curva
        ctx.fillRect(pxPilar, pyPilar, larguraPilar, alturaPilarPx);
        ctx.strokeRect(pxPilar, pyPilar, larguraPilar, alturaPilarPx);

        // Texto dA
        ctx.fillStyle = "red";
        ctx.font = "bold 10px Arial";
        ctx.fillText("dA = dx.dy", pxPilar - 5, pyPilar - 8);

        // DESENHO DA CURVA GAUSSIANA (Perfil de Dissipação)
        ctx.strokeStyle = "#d32f2f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for(let x = -5.5; x <= 5.5; x += 0.1) {
            let px = cx + (x * escalaX);
            let t = 150 * Math.exp(-0.1 * (x * x)) + 40;
            let py = cy - (t * escalaT);
            
            if(x === -5.5) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Labels dos Eixos
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText("T (°C)", cx + 10, 30);
        ctx.fillText("x (cm)", 405, cy + 15);
    }

    // 3. GRÁFICO 3D (PLOTLY - DOMÍNIO RETANGULAR D)
    const xValues = [];
    const yValues = [];
    const zValues = [];

    // Gerar coordenadas reais conforme a imagem: x de -5 a 5 e y de -4 a 4
    for (let x = -5; x <= 5; x += 0.25) xValues.push(x);
    for (let y = -4; y <= 4; y += 0.25) yValues.push(y);

    // Calcular a matriz de Temperaturas T(x,y)
    for (let y of yValues) {
        let row = [];
        for (let x of xValues) {
            let temp = 150 * Math.exp(-0.1 * (x*x + y*y)) + 40;
            row.push(temp);
        }
        zValues.push(row);
    }

    const data3D = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'surface',
        colorscale: 'Hot',
        showscale: true,
        contours: {
            z: { show: true, project: { z: true }, usecolormap: true }
        }
    }];

const layout3D = {
        title: { text: 'Distribuição de Temperatura T(x,y)', font: { size: 14 } },
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 30 },
        scene: {
            xaxis: { 
                title: 'X (cm)', 
                range: [-5.5, 5.5],
                tickvals: [-5, -2.5, 0, 2.5, 5], // Força o aparecimento do -5 e 5
                dtick: 2.5
            },
            yaxis: { 
                title: 'Y (cm)', 
                range: [-4.5, 4.5],
                tickvals: [-4, -2, 0, 2, 4],
                dtick: 2
            },
            zaxis: { 
                title: 'T (°C)', 
                range: [0, 200] 
            },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
            }
        }
    };

    Plotly.newPlot('plot3d', data3D, layout3D);
};
