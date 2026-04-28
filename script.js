window.onload = function() {
    function getTempAt(x, y) {
        return 150 * Math.exp(-0.1 * (x**2 + y**2)) + 40;
    }

    const escala = 25; 

    const configurarAba = (idBtn, idConteudo, texto) => {
        const btn = document.getElementById(idBtn);
        const conteudo = document.getElementById(idConteudo);
        if (btn && conteudo) {
            btn.onclick = function() {
                const escondido = conteudo.classList.toggle('hidden');
                this.innerText = escondido ? "▶ " + texto : "▼ Esconder " + texto;
                if (!escondido && window.MathJax) MathJax.typesetPromise([conteudo]);
            };
        }
    };

    configurarAba('btn-toggle', 'conteudo-calculo', 'Desenvolvimento Algébrico');
    configurarAba('btn-analise', 'conteudo-analise', 'Análise e Interpretação Física');

    // Renderização dos gráficos (Plotly e Canvas) permanece igual à sua versão...
    // [Seu código de Plotly e Canvas aqui]
};
