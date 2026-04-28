function toggleMemorial() {
    const conteudo = document.getElementById('memorial-conteudo');
    conteudo.classList.toggle('hidden');
}

window.onload = function() {
    // 1. Gráfico 3D (Plotly)
    const x = [], y = [], z = [];
    for(let i=-6; i<=6; i+=0.4) x.push(i);
    for(let j=-5; j<=5; j+=0.4) y.push(j);

    for(let j=0; j<y.length; j++) {
        let row = [];
        for(let i=0; i<x.length; i++) {
            let val = 150 * Math.exp(-0.1 * (x[i]**2 + y[j]**2)) + 40;
            row.push(val);
        }
        z.push(row);
    }

    Plotly.newPlot('plot3d', [{
        z: z, x: x, y: y, type: 'surface', colorscale: 'Hot'
    }], {
        margin: {l:0, r:0, b:0, t:0},
        scene: { xaxis: {title: 'X (cm)'}, yaxis: {title: 'Y (cm)'}, zaxis: {title: 'T (°C)'} }
    });

    // 2. Gráfico 2D (Canvas)
    const cv = document.getElementById('canvas2d');
    const ctx = cv.getContext('2d');
    const escala = 25; 
    const cx = cv.width/2; const cy = cv.height/2;

    // Desenha Chapa D
    ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    ctx.fillRect(cx - 5*escala, cy - 4*escala, 10*escala, 8*escala);
    
    // Desenha Eixos
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height);
    ctx.stroke();
};
