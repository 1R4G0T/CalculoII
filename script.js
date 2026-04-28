function gerarGrafico() {
    const xValues = [];
    const yValues = [];
    const zValues = [];

    // Gerar coordenadas x e y de -5 a 5 e -4 a 4
    for (let x = -5; x <= 5; x += 0.2) {
        xValues.push(x);
    }
    for (let y = -4; y <= 4; y += 0.2) {
        yValues.push(y);
    }

    // Calcular T(x,y) = 150 * e^(-0.1 * (x^2 + y^2)) + 40
    for (let i = 0; i < yValues.length; i++) {
        const row = [];
        for (let j = 0; j < xValues.length; j++) {
            const x = xValues[j];
            const y = yValues[i];
            const t = 150 * Math.exp(-0.1 * (Math.pow(x, 2) + Math.pow(y, 2))) + 40;
            row.push(t);
        }
        zValues.push(row);
    }

    const data = [{
        z: zValues,
        x: xValues,
        y: yValues,
        type: 'surface',
        colorscale: 'Hot',
        colorbar: { title: 'Temp °C' }
    }];

    const layout = {
        title: 'Distribuição Térmica na Chapa',
        autosize: true,
        scene: {
            xaxis: { title: 'X (cm)' },
            yaxis: { title: 'Y (cm)' },
            zaxis: { title: 'T (°C)' }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: '#2c3e50',
        font: { color: '#fff' }
    };

    Plotly.newPlot('plot3d', data, layout);
}

// Inicializa o gráfico quando a página carregar
window.onload = gerarGrafico;
