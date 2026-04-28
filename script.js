window.onload = function() {
    
    // Função genérica para os botões
    function configurarBotao(idBotao, idConteudo) {
        const btn = document.getElementById(idBotao);
        const conteudo = document.getElementById(idConteudo);
        if (btn && conteudo) {
            btn.onclick = function() {
                const estaEscondido = conteudo.classList.contains('escondido');
                conteudo.classList.toggle('escondido');
                
                // Muda o ícone e o texto
                const acao = estaEscondido ? "Esconder" : "Mostrar";
                const seta = estaEscondido ? "▼" : "▶";
                
                if(idBotao === 'btn-toggle-explica') {
                    btn.innerText = `${seta} ${acao} Explicação`;
                } else {
                    btn.innerText = `${seta} ${acao} Desenvolvimento`;
                }
            };
        }
    }

    // Configura as duas abas
    configurarBotao('btn-toggle-explica', 'conteudo-explica');
    configurarBotao('btn-toggle-corrido', 'conteudo-corrido');

    // ... Manter as funções init3D() e init2D() que já estão funcionando ...
    init3D();
    init2D();
};
