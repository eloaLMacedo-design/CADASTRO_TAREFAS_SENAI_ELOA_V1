const campoTarefa = document.getElementById('campo-tarefa');
const campoPrazo = document.getElementById('campo-prazo');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const listaConcluidas = document.getElementById('lista-concluidas');
const listaAtrasadas = document.getElementById('lista-atrasadas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const cardConcluidas = document.getElementById('card-concluidas');
const cardAtrasadas = document.getElementById('card-atrasadas');
let totalDeTarefas = 0;

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();
    const prazo = campoPrazo.value;
    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    if (prazo === '') {
        alert('Por favor, coloque um prazo para a tarefa!');
        return;
    }
    const itemLista = document.createElement('li');
    itemLista.className = 'item-tarefa';
    itemLista.dataset.prazo = prazo;
    itemLista.innerHTML = `

        <div class="informacoes-tarefa">

            <span class="texto-tarefa">
                ${textoTarefa}
            </span>

            <small>
                Prazo: ${formatarData(prazo)}
            </small>

        </div>


        <div class="acoes-tarefa">

            <button
                class="botao-acao concluir"
                title="Concluir tarefa"
            >

                <i class="fa-regular fa-circle-check"></i>

            </button>


            <button
                class="botao-acao excluir"
                title="Excluir tarefa"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;
    itemLista.querySelector('.concluir').addEventListener('click', () => {
        itemLista.classList.remove('atrasada');
        itemLista.classList.add('concluido');
        listaConcluidas.appendChild(itemLista);
        verificarCards();
    });
    itemLista.querySelector('.excluir').addEventListener('click', () => {
        itemLista.remove();
        totalDeTarefas--;
        atualizarContador();
        verificarCards();
    });

    listaTarefas.appendChild(itemLista);
    campoTarefa.value = '';
    campoPrazo.value = '';
    totalDeTarefas++;
    atualizarContador();
    verificarCards();
}
function formatarData(data) {
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function verificarTarefasAtrasadas() {
    const tarefas = document.querySelectorAll(
        '#lista-tarefas .item-tarefa'
    );
    const agora = new Date();
    tarefas.forEach((tarefa) => {
        const prazo = new Date(
            tarefa.dataset.prazo
        );
        if (prazo < agora) {
            tarefa.classList.add('atrasada');
            listaAtrasadas.appendChild(tarefa);

        }

    });
    verificarCards();
}
function atualizarContador() {

    contadorTarefas.textContent =
        `${totalDeTarefas} ${
            totalDeTarefas === 1
                ? 'tarefa': 'tarefas'
        } na lista`;
}

function verificarCards() {
    if (listaConcluidas.children.length > 0) {
        cardConcluidas.classList.add('visivel');
    } else {
        cardConcluidas.classList.remove('visivel');
    }

    if (listaAtrasadas.children.length > 0) {
        cardAtrasadas.classList.add('visivel');
    } else {
        cardAtrasadas.classList.remove('visivel');
    }
}
botaoAlternarTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const iconeTema = botaoAlternarTema.querySelector('i');
    iconeTema.classList.toggle('fa-moon');
    iconeTema.classList.toggle('fa-sun');

});
botaoAdicionar.addEventListener(
    'click',
    adicionarTarefa
);

campoTarefa.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});
 
setInterval(() => {
    verificarTarefasAtrasadas();
}, 1000);
 
verificarCards();