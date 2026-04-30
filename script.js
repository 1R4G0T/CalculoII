window.onload = function() {
    // Configuração dos Botões de Toggle (Memorial e Análise)
    const setupToggle = (btnId, contentId) => {
        const btn = document.getElementById(btnId);
        const content = document.getElementById(contentId);
        if (btn && content) {
            btn.onclick = function() {
                content.classList.toggle('hidden');
                const isHidden = content.classList.contains('hidden');
                this.innerHTML = (isHidden ? "▶ " : "▼ ") + this.innerText.substring(2);
                if (!isHidden && window.MathJax) MathJax.typesetPromise();
            };
        }
    };

    setupToggle('btn-toggle', 'conteudo-calculo');
    setupToggle('btn-analise', 'conteudo-analise');

    // --- RENDERIZAÇÃO DO GRÁFICO DE CORTE (Canvas) ---
    const cv = document.getElementById('graficoCorte');
    if (cv) {
        const ctx = cv.getContext('2d');
        // Ajuste de tamanho para o container compacto
        cv.width = 440; 
        cv.height = 220;
        
        const cx = cv.width / 2;   // Centro do eixo X
        const cy = cv.height - 50; // Base do eixo Y (Temperatura 0)
        const escalaX = 35;        // Proporção cm -> px
        const escalaY = 0.6;       // Proporção °C -> px

        ctx.clearRect(0, 0, cv.width, cv.height);

        // 1. DESENHAR EIXOS CARTESIANOS (X e Y)
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        
        // Eixo X (Posição horizontal)
        ctx.beginPath();
        ctx.moveTo(20, cy);
        ctx.lineTo(cv.width - 20, cy);
        ctx.stroke();

        // Eixo Y (Temperatura)
        ctx.beginPath();
        ctx.moveTo(cx, 20);
        ctx.lineTo(cx, cy + 20);
        ctx.stroke();

        // 2. DESENHAR O PILAR dA (dx * dy)
        // Representado como um elemento diferencial na base da integral
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; 
        ctx.strokeStyle = "#ff0000";
        const daWidth = 20;
        const daHeight = 20;
        const xPos = cx + (1.5 * escalaX); // Posicionado em x = 1.5
        const yPos = cy - daHeight;        // Sobre o eixo X
        
        ctx.fillRect(xPos, yPos, daWidth, daHeight);
        ctx.strokeRect(xPos, yPos, daWidth, daHeight);
        
        // Legenda do Pilar
        ctx.fillStyle = "#ff0000";
        ctx.font = "bold 10px Arial";
        ctx.fillText("dA = dx·dy", xPos - 10, yPos - 5);

        // 3. DESENHAR A CURVA GAUSSIANA (Perfil Térmico)
        ctx.strokeStyle = "#d32f2f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = -5.5; x <= 5.5; x += 0.1) {
            let px = cx + (x * escalaX);
            // Função T(x, 0) = 150 * e^(-0.1 * x²) + 40
            let temp = 150 * Math.exp(-0.1 * Math.pow(x, 2)) + 40;
            let py = cy - (temp * escalaY);
            
            if (x === -5.5) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // 4. IDENTIFICAÇÃO DOS EIXOS E PONTOS
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.fillText("T (°C)", cx + 10, 30);
        ctx.fillText("x (cm)", cv.width - 45, cy + 20);
        
        // Marcador de Pico (190°C)
        ctx.fillStyle = "#d32f2f";
        ctx.fillText("Pico: 190°C", cx + 5, cy - (190 * escalaY) - 5);
    }

    // --- GRÁFICO 3D (Plotly) ---
    const zData = Array.from({length: 25}, (_, y) => 
        Array.from({length: 25}, (_, x) => 
            150 * Math.exp(-0.1 * (Math.pow((x-12)/4,2) + Math.pow((y-12)/4,2))) + 40
        )
    );
    Plotly.newPlot('plot3d', [{
        z: zData, 
        type: 'surface', 
        colorscale: 'Hot'
    }], {
        margin: {l:0, r:0, b:0, t:0},
        scene: { camera: { eye: {x: 1.5, y: 1.5, z: 1.2} } }
    });
};
