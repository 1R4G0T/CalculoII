window.onload = function() {
    // --- Lógica do Memorial de Cálculo ---
    const btnToggle = document.getElementById('btn-toggle');
    const conteudoCalculo = document.getElementById('conteudo-calculo');

    if (btnToggle && conteudoCalculo) {
        btnToggle.onclick = function() {
            const isHidden = conteudoCalculo.classList.toggle('hidden');
            this.innerHTML = isHidden ? '▶ Mostrar Desenvolvimento Algébrico' : '▼ Esconder Memorial';
        };
    }

    // --- Lógica da Análise Física (O botão verde) ---
    const btnAnalise = document.getElementById('btn-analise');
    const conteudoAnalise = document.getElementById('conteudo-analise');

    if (btnAnalise && conteudoAnalise) {
        btnAnalise.onclick = function() {
            const isHidden = conteudoAnalise.classList.toggle('hidden');
            this.innerHTML = isHidden ? '▶ Mostrar Análise e Interpretação Física' : '▼ Esconder Análise Técnica';
            
            // Renderiza as fórmulas caso existam na análise
            if (!isHidden && window.MathJax) {
                MathJax.typesetPromise([conteudoAnalise]);
            }
        };
    }
};
