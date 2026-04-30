window.onload = function() {
    // Toggles dos botões
    const toggle = (idBtn, idCont) => {
        document.getElementById(idBtn).onclick = function() {
            const c = document.getElementById(idCont);
            c.classList.toggle('hidden');
            this.innerText = (c.classList.contains('hidden') ? "▶ " : "▼ ") + this.innerText.substring(2);
        };
    };
    toggle('btn-toggle', 'conteudo-calculo');
    toggle('btn-analise', 'conteudo-analise');

    // Gráfico de Corte em Y=0
    const cv = document.getElementById('graficoCorte');
    const ctx = cv.getContext('2d');
    cv.width = 440; cv.height = 180;

    function drawCorte() {
        const ox = 220, oy = 150; // Origem
        ctx.clearRect(0,0,440,180);
        
        // Eixos Cartesianos
        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(20, oy); ctx.lineTo(420, oy); // Eixo X
        ctx.moveTo(ox, 10); ctx.lineTo(ox, 170); // Eixo T
        ctx.stroke();

        // Curva de Temperatura (Gaussiana)
        ctx.strokeStyle = "#d32f2f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let x = -5.5; x <= 5.5; x += 0.1) {
            let px = ox + (x * 35);
            let temp = 150 * Math.exp(-0.1 * (x*x)) + 40;
            let py = oy - (temp * 0.6);
            if(x === -5.5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Labels
        ctx.fillStyle = "#000"; ctx.font = "10px Arial";
        ctx.fillText("T(°C)", ox + 5, 20);
        ctx.fillText("x (cm)", 400, oy + 15);
    }
    drawCorte();

    // Gráfico 3D Plotly
    const zData = Array.from({length: 25}, (_, y) => 
        Array.from({length: 25}, (_, x) => 
            150 * Math.exp(-0.1 * (Math.pow((x-12)/4,2) + Math.pow((y-12)/4,2))) + 40
        )
    );
    Plotly.newPlot('plot3d', [{z: zData, type: 'surface', colorscale: 'YlOrRd'}], 
        {margin: {l:0,r:0,b:0,t:0}, scene:{camera:{eye:{x:1.2, y:1.2, z:1.1}}}}
    );
};
