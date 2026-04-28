window.onload = function() {
    // Alternância das abas
    function toggleAba(idBtn, idContent) {
        const btn = document.getElementById(idBtn);
        const div = document.getElementById(idContent);
        if(btn && div) {
            btn.onclick = () => {
                const escondido = div.classList.toggle('escondido');
                btn.innerText = (escondido ? "▶ Mostrar " : "▼ Esconder ") + btn.innerText.split(' ').slice(1).join(' ');
            };
        }
    }
    toggleAba('btn-toggle-explica', 'conteudo-explica');
    toggleAba('btn-toggle-corrido', 'conteudo-corrido');

    // Gráfico 3D - T(x,y)
    (function init3D() {
        const x = [], y = [], z = [];
        for(let i=-6; i<=6; i+=0.5) x.push(i);
        for(let j=-5; j<=5; j+=0.5) y.push(j);

        for(let j=0; j<y.length; j++) {
            let row = [];
            for(let i=0; i<x.length; i++) {
                row.push(150 * Math.exp(-0.1 * (Math.pow(x[i],2) + Math.pow(y[j],2))) + 40);
            }
            z.push(row);
        }

        Plotly.newPlot('plot3d', [{z: z, x: x, y: y, type: 'surface', colorscale: 'Hot'}], 
            {margin: {l:0,r:0,b:0,t:0}, scene: {xaxis:{title:'X'}, yaxis:{title:'Y'}, zaxis:{title:'T °C'}}});
    })();

    // Gráfico 2D - Domínio D
    (function init2D() {
        const cv = document.getElementById('meuGrafico2d');
        const ctx = cv.getContext('2d');
        const esc = 22; const cX = cv.width/2; const cY = cv.height/2;

        ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
        ctx.fillRect(cX-5*esc, cY-4*esc, 10*esc, 8*esc); // Limites x[-5,5], y[-4,4]
        
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, cY); ctx.lineTo(cv.width, cY); // Eixo X
        ctx.moveTo(cX, 0); ctx.lineTo(cX, cv.height); // Eixo Y
        ctx.stroke();
    })();
};
