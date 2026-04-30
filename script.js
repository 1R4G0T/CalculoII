window.onload = function() {
    // Configuração dos Botões
    const toggle = (idBtn, idCont) => {
        const b = document.getElementById(idBtn);
        const c = document.getElementById(idCont);
        if(b) b.onclick = () => {
            c.classList.toggle('hidden');
            const isHidden = c.classList.contains('hidden');
            b.innerHTML = (isHidden ? "▶ " : "▼ ") + b.innerText.substring(2);
            if (!isHidden && window.MathJax) MathJax.typesetPromise();
        };
    };
    toggle('btn-toggle', 'conteudo-calculo');
    toggle('btn-analise', 'conteudo-analise');

    // --- GRÁFICO DE CORTE EM Y=0 ---
    const canvas = document.getElementById('graficoCorte');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 440; canvas.height = 220;
        
        const cx = 220; // Centro X
        const cy = 170; // Base Y (Eixo Horizontal)

        // 1. Eixos Pretos
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(420, cy); // Eixo X
        ctx.moveTo(cx, 20); ctx.lineTo(cx, cy + 20); // Eixo T
        ctx.stroke();

        // 2. Pilar dA (dx * dy) - O detalhe que faltava
        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.strokeStyle = "red";
        ctx.fillRect(cx + 60, cy - 30, 25, 30); // Posição arbitrária para ilustrar
        ctx.strokeRect(cx + 60, cy - 30, 25, 30);
        ctx.fillStyle = "red";
        ctx.font = "bold 10px Arial";
        ctx.fillText("dA = dx.dy", cx + 55, cy - 35);

        // 3. Curva de Temperatura (Gaussiana)
        ctx.strokeStyle = "#d32f2f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for(let x = -5.5; x <= 5.5; x += 0.1) {
            let px = cx + (x * 35);
            let temp = 150 * Math.exp(-0.1 * (x*x)) + 40;
            let py = cy - (temp * 0.6);
            if(x === -5.5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Labels
        ctx.fillStyle = "#000"; ctx.font = "12px Arial";
        ctx.fillText("T (°C)", cx + 10, 30);
        ctx.fillText("x (cm)", 400, cy + 20);
    }

    // --- PLOTLY 3D ---
    const zData = Array.from({length: 30}, (_, y) => 
        Array.from({length: 30}, (_, x) => 
            150 * Math.exp(-0.1 * (Math.pow((x-15)/5,2) + Math.pow((y-15)/5,2))) + 40
        )
    );
    Plotly.newPlot('plot3d', [{z: zData, type: 'surface', colorscale: 'Viridis'}], 
        {margin: {l:0,r:0,b:0,t:0}, scene:{camera:{eye:{x:1.5, y:1.5, z:1.2}}}}
    );
};
