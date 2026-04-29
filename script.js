window.onload = function() {
    // Lógica para o Gráfico 3D (Plotly)
    const getTempAt = (x, y) => 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    const xV = [], yV = [], zV = [];
    for(let i=-6; i<=6; i+=0.4) xV.push(i);
    for(let j=-5; j<=5; j+=0.4) yV.push(j);
    for(let j=0; j<yV.length; j++) {
        let r = [];
        for(let i=0; i<xV.length; i++) r.push(getTempAt(xV[i], yV[j]));
        zV.push(r);
    }

    Plotly.newPlot('plot3d', [{
        z: zV, x: xV, y: yV, type: 'surface', colorscale: 'Hot'
    }], {
        paper_bgcolor: 'rgba(0,0,0,0)',
        scene: { xaxis: {color: '#fff'}, yaxis: {color: '#fff'}, zaxis: {color: '#fff'} },
        margin: {l:0, r:0, b:0, t:0}
    });

    // Controle do Memorial de Cálculo
    const btnToggle = document.getElementById('btn-toggle');
    const conteudoCalculo = document.getElementById('conteudo-calculo');
    btnToggle.onclick = () => {
        const isHidden = conteudoCalculo.classList.toggle('hidden');
        btnToggle.innerHTML = isHidden ? '▶ Mostrar Desenvolvimento' : '▼ Esconder Memorial';
    };

    // Controle da Análise Física (O que precisava arrumar)
    const btnAnalise = document.getElementById('btn-analise');
    const conteudoAnalise = document.getElementById('conteudo-analise');
    btnAnalise.onclick = () => {
        const isHidden = conteudoAnalise.classList.toggle('hidden');
        btnAnalise.innerHTML = isHidden ? '▶ Mostrar Análise Física' : '▼ Esconder Análise';
        if (!isHidden && window.MathJax) MathJax.typeset();
    };
};
