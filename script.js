window.onload = function() {
    // --- Lógica do Botão ---
    const btn = document.getElementById('btn-toggle');
    const conteudo = document.getElementById('conteudo-calculo');

    if(btn && conteudo) {
        btn.onclick = function() {
            if (conteudo.classList.contains('escondido')) {
                conteudo.classList.remove('escondido');
                btn.innerText = "▼ Esconder Passo a Passo";
            } else {
                conteudo.classList.add('escondido');
                btn.innerText = "▶ Mostrar Passo a Passo";
            }
        };
    }

    // --- Gráfico 3D (Plotly) ---
    function init3D() {
        const x = [], y = [], z = [];
        for(let i=-6; i<=6; i+=0.5) x.push(i);
        for(let j=-5; j<=5; j+=0.5) y.push(j);

        for(let j=0; j<y.length; j++) {
            let row = [];
            for(let i=0; i<x.length; i++) {
                row.push(150 * Math.exp(-0.1 * (x[i]**2 + y[j]**2)) + 40);
            }
            z.push(row);
        }

        Plotly.newPlot('plot3d', [{
            z: z, x: x, y: y, type: 'surface', colorscale: 'Hot'
        }], { 
            margin: {l:0, r:0, b:0, t:0},
            scene: { xaxis:{title:'X'}, yaxis:{title:'Y'}, zaxis:{title:'T'}}
        });
    }

    // --- Gráfico 2D (Canvas) ---
    function init2D() {
        const cv = document.getElementById('meuGrafico2d');
        const ctx = cv.getContext('2d');
        const esc = 20;
        const cX = cv.width/2;
        const cY = cv.height/2;

        ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
        ctx.fillRect(cX-5*esc, cY-4*esc, 10*esc, 8*esc); // Chapa
        
        ctx.beginPath();
        ctx.moveTo(0, cY); ctx.lineTo(cv.width, cY);
        ctx.moveTo(cX, 0); ctx.lineTo(cX, cv.height);
        ctx.stroke();

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(cX+1.5*esc, cY-2*esc, 20, 20); // dx dy
        ctx.fillText("dA", cX+1.5*esc, cY-2.5*esc);
    }

    // --- Diagrama dA em Volume ---
    document.getElementById('diagrama-da-3d').innerHTML = 
        "<div style='border:2px solid #e74c3c; padding:10px;'>dx · dy (Base) <br> × <br> T(x,y) (Altura)</div>";

    init3D();
    init2D();
};
