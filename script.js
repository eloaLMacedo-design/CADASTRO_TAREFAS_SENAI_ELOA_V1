const campoTarefa = document.getElementById('campo-tarefa');
const campoPrazo = document.getElementById('campo-prazo');
const campoCategoria = document.getElementById('campo-categoria');
const campoPrioridade = document.getElementById('campo-prioridade');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const listaConcluidas = document.getElementById('lista-concluidas');
const listaAtrasadas = document.getElementById('lista-atrasadas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const cardConcluidas = document.getElementById('card-concluidas');
const cardAtrasadas = document.getElementById('card-atrasadas');
const botoesFiltro = document.querySelectorAll('.filtro');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let filtroAtual = 'todas';
function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function adicionarTarefa() {
    const texto = campoTarefa.value.trim();
    const prazo = campoPrazo.value;
    const categoria = campoCategoria.value;
    const prioridade = campoPrioridade.value;

    if (texto === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    if (prazo === '') {
        alert('Por favor, coloque um prazo para a tarefa!');
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        prazo: prazo,
        categoria: categoria,
        prioridade: prioridade,
        concluida: false

    };

    tarefas.push(novaTarefa);

    salvarTarefas();

    renderizarTarefas();

    campoTarefa.value = '';
    campoPrazo.value = '';

}

function renderizarTarefas() {
    listaTarefas.innerHTML = '';
    listaConcluidas.innerHTML = '';
    listaAtrasadas.innerHTML = '';

    const agora = new Date();

    tarefas.forEach(tarefa => {

        const prazo = new Date(tarefa.prazo);

        const atrasada =
            prazo < agora && !tarefa.concluida;

        const itemLista = document.createElement('li');

        itemLista.className = 'item-tarefa';


        if (tarefa.concluida) {
            itemLista.classList.add('concluido');
        }

        if (atrasada) {
            itemLista.classList.add('atrasada');
        }

        itemLista.dataset.id = tarefa.id;

        if (
            filtroAtual === 'pendentes' &&
            tarefa.concluida
        ) {
            return;
        }

        if (
            filtroAtual === 'concluidas' &&
            !tarefa.concluida
        ) {
            return;
        }

        const informacoes = document.createElement('div');

        informacoes.className = 'informacoes-tarefa';

        const textoTarefa = document.createElement('span');

        textoTarefa.className = 'texto-tarefa';

        textoTarefa.textContent = tarefa.texto;

        const detalhes = document.createElement('small');

        detalhes.innerHTML =
            `📅 ${formatarData(tarefa.prazo)}
             • 🏷️ ${tarefa.categoria}`;

        const prioridade = document.createElement('span');

        prioridade.className =
            `prioridade ${tarefa.prioridade}`;

        if (tarefa.prioridade === 'alta') {
            prioridade.textContent = '🔴 Alta';
        } else if (tarefa.prioridade === 'media') {
            prioridade.textContent = '🟡 Média';
        } else {
            prioridade.textContent = '🟢 Baixa';
        }
        
        informacoes.appendChild(textoTarefa);

        informacoes.appendChild(detalhes);

        informacoes.appendChild(prioridade);

        const acoes = document.createElement('div');
        acoes.className = 'acoes-tarefa';
        const botaoConcluir = document.createElement('button');
        botaoConcluir.className =
            'botao-acao concluir';

        botaoConcluir.title =
            'Concluir tarefa';

        botaoConcluir.innerHTML =
            '<i class="fa-regular fa-circle-check"></i>';

        const botaoEditar = document.createElement('button');

        botaoEditar.className =
            'botao-acao editar';

        botaoEditar.title =
            'Editar tarefa';

        botaoEditar.innerHTML =
            '<i class="fa-solid fa-pen"></i>';

        const botaoExcluir = document.createElement('button');

        botaoExcluir.className =
            'botao-acao excluir';

        botaoExcluir.title =
            'Excluir tarefa';

        botaoExcluir.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        acoes.appendChild(botaoConcluir);
        acoes.appendChild(botaoEditar);
        acoes.appendChild(botaoExcluir);
        itemLista.appendChild(informacoes);
        itemLista.appendChild(acoes);

        if (tarefa.concluida) {
            listaConcluidas.appendChild(itemLista);
        } else if (atrasada) {
            listaAtrasadas.appendChild(itemLista);
        } else {
            listaTarefas.appendChild(itemLista);
        }

        botaoConcluir.addEventListener('click', () => {
            tarefa.concluida = !tarefa.concluida;
            salvarTarefas();
            renderizarTarefas();
        });

        botaoEditar.addEventListener('click', () => {

            const novoTexto =
                prompt(
                    'Edite sua tarefa:',
                    tarefa.texto
                );


            if (
                novoTexto !== null &&
                novoTexto.trim() !== ''
            ) {

                tarefa.texto =
                    novoTexto.trim();

                salvarTarefas();

                renderizarTarefas();

            }

        });

        botaoExcluir.addEventListener('click', () => {

            tarefas =
                tarefas.filter(
                    item => item.id !== tarefa.id
                );


            salvarTarefas();

            renderizarTarefas();

        });

    });

    atualizarContador();
    verificarCards();

}

function formatarData(data) {

    const dataFormatada =
        new Date(data);
    return dataFormatada.toLocaleString(
        'pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    );
}

function atualizarContador() {
    const quantidade =
        tarefas.length;
    contadorTarefas.textContent =
        `${quantidade} ${quantidade === 1
            ? 'tarefa' : 'tarefas'
        } na lista`;

}

function verificarCards() {

    if (
        tarefas.some(
            tarefa => tarefa.concluida
        )
    ) {
        cardConcluidas.classList.add('visivel');
    } else {
        cardConcluidas.classList.remove('visivel');
    }

    const agora = new Date();

    if (
        tarefas.some(
            tarefa =>
                !tarefa.concluida &&
                new Date(tarefa.prazo) < agora
        )
    ) {
        cardAtrasadas.classList.add('visivel');
    } else {
        cardAtrasadas.classList.remove('visivel');
    }
}

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(item => {
            item.classList.remove('ativo');
        });
        botao.classList.add('ativo');
        filtroAtual =
            botao.dataset.filtro;
        renderizarTarefas();
    });

});

botaoAlternarTema.addEventListener(
    'click',
    () => {

        document.body.classList.toggle(
            'modo-escuro'
        );


        const iconeTema =
            botaoAlternarTema.querySelector('i');

        iconeTema.classList.toggle(
            'fa-moon'
        );
        iconeTema.classList.toggle(
            'fa-sun'
        );
    }
);

botaoAdicionar.addEventListener(
    'click',
    adicionarTarefa
);

campoTarefa.addEventListener(
    'keypress',
    evento => {
        if (evento.key === 'Enter') {
            adicionarTarefa();
        }
    }
);

setInterval(() => {
    const agora = new Date();

    tarefas.forEach(tarefa => {
        if (
            !tarefa.concluida &&
            new Date(tarefa.prazo) < agora
        ) {
            const item = document.querySelector(
                `[data-id="${tarefa.id}"]`
            );

            if (item && !item.classList.contains('atrasada')) {
                renderizarTarefas();
            }
        }
    });
}, 1000);

renderizarTarefas();