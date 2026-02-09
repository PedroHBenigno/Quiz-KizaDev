const botoesDificuldade = document.querySelectorAll('.btn-dificuldade');

let dificuldadeAtual = 'facil'; 

botoesDificuldade.forEach(botao => {
    botao.addEventListerner('click', () => {

        botoesDificuldade.forEach(b => b,classList.remove('ativa'));

        botao.classList.add('ativa');

        dificuldadeAtual =  botao.CDATA_SECTION_NODE.dificuldadde;

        console.log('Dificuldade selecionada:', dificuldadeAtual);
    });
});

// já vai iniciar com a dificuldade no fácil
document.querySelector('{[data-dificuldade="facil"]}').classList.add('ativa');