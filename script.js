window.onload = function() {
    // 1. CONFIGURAÇÃO DOS BOTÕES (TOGGLES)
    const toggle = (idBtn, idCont) => {
        const b = document.getElementById(idBtn);
        const c = document.getElementById(idCont);
        if(b && c) {
            b.onclick = () => {
                c.classList.toggle('hidden');
                const isHidden = c.classList.contains('hidden');
                // Atualiza o ícone (substituindo os dois primeiros caracteres)
                b.innerHTML = (isHidden ? "▶ " : "▼ ") + b.innerText.substring(2);
                if (!isHidden && window.MathJax) {
                    MathJax.typesetPromise();
                }
            };
        }
    };

    toggle('btn-toggle', 'conteudo-calculo');
    toggle('btn-analise', 'conteudo-analise');

    // 2. GRÁFICO DE CORTE LATERAL (2D CANVAS)
    const canvas = document.getElementById('graficoCorte');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = 440; 
        canvas.height = 220;
        
        const cx = 220; // Centro
        const cy = 180; // Base
        const escalaX = 35; 
        const escalaT = 0.7; 

        // Eixos
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(420, cy);
        ctx.moveTo(cx, 20); ctx.lineTo(cx, cy + 20);
        ctx.stroke();

        // Pilar dA
        const xAmostra = 1.5; 
        const tempNoPonto = 150 * Math.exp(-0.1 * (xAmostra * xAmostra)) + 40; 
        const pyPilar = cy - (tempNoPonto * escalaT);

        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.strokeStyle = "red";
        ctx.fillRect(cx + (xAmostra * escalaX), pyPilar, 25, (tempNoPonto * escalaT));
        ctx.strokeRect(cx + (xAmostra * escalaX), pyPilar, 25, (tempNoPonto * escalaT));

        // Curva
        ctx.strokeStyle = "#d32f2f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for(let x = -5.5; x <= 5.5; x += 0.1) {
            let px = cx + (x * escalaX);
            let t = 150 * Math.exp(-0.1 * (x * x)) + 40;
            let py = cy - (t * escalaT);
            if(x === -5.5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // 3. GRÁFICO 3D (PLOTLY)
    const xValues = [];
    const yValues = [];
    const zValues = [];

    for (let x = -5; x <= 5; x += 0.25) xValues.push(x);
    for (let y = -4; y <= 4; y += 0.25) yValues.push(y);

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
        cmin: 40,
        cmax: 190,
        contours: {
            z: { show: true, project: { z: true }, usecolormap: true }
        }
    }];

    const layout3D = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: 'X (cm)', range: [-5.5, 5.5] },
            yaxis: { title: 'Y (cm)', range: [-4.5, 4.5] },
            zaxis: { title: 'T (°C)', range: [0, 200] }
        }
    };

    Plotly.newPlot('plot3d', data3D, layout3D);
};
