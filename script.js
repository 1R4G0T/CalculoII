window.onload = function() {
    // ... (mantenha seus códigos de gráficos Plotly e Canvas aqui) ...

    // Lógica do Botão Memorial
    const btnToggle = document.getElementById('btn-toggle');
    const conteudoCalculo = document.getElementById('conteudo-calculo');

    btnToggle.onclick = function() {
        const isHidden = conteudoCalculo.classList.toggle('hidden');
        this.innerHTML = isHidden ? '▶ Mostrar Memorial' : '▼ Esconder Memorial';
    };

    // Lógica do Botão de Análise (O que estava faltando)
    const btnAnalise = document.getElementById('btn-analise');
    const conteudoAnalise = document.getElementById('conteudo-analise');

    btnAnalise.onclick = function() {
        const isVisible = conteudoAnalise.classList.toggle('visible');
        conteudoAnalise.classList.toggle('hidden', !isVisible);
        
        // Altera o texto e o ícone do botão
        this.innerHTML = isVisible ? 
            '▼ Esconder Análise Física' : 
            '▶ Mostrar Análise e Interpretação Física';
            
        // Força o MathJax a re-renderizar se houver fórmulas na análise
        if (isVisible && window.MathJax) {
            MathJax.typesetPromise([conteudoAnalise]);
        }
    };
};
