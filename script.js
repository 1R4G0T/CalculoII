window.onload = function() {
    // 1. Controle das Abas
    function setupToggle(btnId, contentId) {
        const btn = document.getElementById(btnId);
        const div = document.getElementById(contentId);
        if(btn && div) {
            btn.onclick = () => {
                const isHidden = div.classList.toggle('escondido');
                btn.innerText = (isHidden ? "▶ Mostrar " : "▼ Esconder ") + btn.innerText.split(' ').slice(1).join(' ');
            };
        }
    }
    setupToggle('btn-toggle-explica', 'conteudo-explica');
    setupToggle('btn-toggle-corrido', 'conteudo-corrido');

    // 2. Gráfico 3D (Plotly)
    (function init3D() {
        const x = [], y = [], z = [];
        for(let i=-6; i<=6; i+=0.5) x.push(i);
        for(let j=-5; j<=5; j+=0.5) y.push(j);

        for(let j=0; j<y.length; j++) {
            let row = [];
            for(let i=0; i<x.length; i++) {
                // T(x,y) = 150e^(-0.1(x²+y²)) + 40
                row.push(150 * Math.exp(-0.1 * (x[i]**2 + y[j]**2)) + 40);
            }
            z.push(row);
        }

        Plotly.newPlot('plot3d', [{
            z: z, x: x, y: y, type: 'surface', colorscale: 'Hot'
        }], {
            margin: {l:0, r:0, b:0, t:0},
            scene: { xaxis:{title:'X cm'}, yaxis:{title:'Y cm'}, zaxis:{title:'T °C'}}
        });
    })();

    // 3. Gráfico 2D (Canvas)
    (function init2D() {
        const cv = document.getElementById('meuGrafico2d');
        const ctx = cv.getContext('2d');
        const esc = 22; // Escala
        const cX = cv.width/2; const cY = cv.height/2;

        // Chapa D: x[-5,5], y[-4,4]
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(cX-5*esc, cY-4*esc, 10*esc, 8*esc);
        
        // Eixos
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, cY); ctx.lineTo(cv.width, cY);
        ctx.moveTo(cX, 0); ctx.lineTo(cX, cv.height);
        ctx.stroke();

        // Elemento dA
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cX+2*esc, cY-2*esc, 15, 15);
        ctx.fillText("dA", cX+2*esc, cY-2.2*esc);
    })();

    // 4. Diagrama Conceitual
    document.getElementById('diagrama-da-3d').innerHTML = `
        <div style="border:2px dashed #e74c3c; padding:10px;">
            Volume = <span style="color:#e74c3c">dA</span> × <span style="color:#2c3e50">T(x,y)</span>
        </div>`;
};
