let nivelAtual = 1;
let rodadaAtual = 0;
let pontuacaoNivel = 0;
let pontuacaoTotalGeral = 0;
let perguntasDaPartida = [];
let historicoNiveis = [];

const nomesNiveis = {
    1: "Nível 1: Básico",
    2: "Nível 2: Intermediário",
    3: "Nível 3: Avançado"
};

function iniciarJogo() {
    document.getElementById("tela-inicial").classList.add("hidden");
    nivelAtual = 1;
    pontuacaoTotalGeral = 0;
    historicoNiveis = [];
    iniciarNivel(nivelAtual);
}

function iniciarNivel(nivel) {
    rodadaAtual = 0;
    pontuacaoNivel = 0;
    
    let cenariosDoNivel = cenarios.filter(c => c.nivel === nivel);
    
    for (let i = cenariosDoNivel.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cenariosDoNivel[i], cenariosDoNivel[j]] = [cenariosDoNivel[j], cenariosDoNivel[i]];
    }
    
    perguntasDaPartida = cenariosDoNivel;
    document.getElementById("badge-nivel").innerText = `Nível ${nivel}/3`;
    carregarRodada(rodadaAtual);
}

function carregarRodada(index) {
    const dados = perguntasDaPartida[index];
    document.getElementById("var-nome").innerText = dados.nome;
    document.getElementById("var-numero").innerText = dados.numero;
    document.getElementById("var-dia").innerText = dados.dia;
    document.getElementById("var-horario").innerText = dados.horario;
    document.getElementById("var-conteudo").innerText = dados.conteudo;
    document.getElementById("contador-rodada").innerText = `${index + 1}/${perguntasDaPartida.length}`;
    const fotoEl = document.getElementById("var-foto");
    const iconeEl = document.getElementById("var-foto-icone");
    iconeEl.style.display = "none";
    fotoEl.style.display = "block";
    fotoEl.src = dados.foto;
}

function verificarResposta(jogadorAchaQueEGolpe) {
    const dados = perguntasDaPartida[rodadaAtual];
    const acertou = (jogadorAchaQueEGolpe === dados.eGolpe);
    const modal = document.getElementById("modal-feedback");
    const icone = document.getElementById("modal-icone");
    const titulo = document.getElementById("modal-titulo");
    const explicacao = document.getElementById("modal-explicacao");

    if (acertou) {
        pontuacaoNivel++;
        pontuacaoTotalGeral++;
        icone.innerText = "✅";
        titulo.innerText = "Você Acertou!";
        titulo.style.color = "#22c55e";
    } else {
        icone.innerText = "❌";
        titulo.innerText = "Você Errou!";
        titulo.style.color = "#ef4444";
    }

    explicacao.innerHTML = dados.explicacao;
    modal.classList.remove("hidden");
}

function proximaRodada() {
    const modal = document.getElementById("modal-feedback");
    modal.classList.add("hidden");
    rodadaAtual++;
    
    if (rodadaAtual < perguntasDaPartida.length) {
        carregarRodada(rodadaAtual);
    } else {
        finalizarNivel();
    }
}

function finalizarNivel() {
    const totalPerguntasNivel = perguntasDaPartida.length;
    const errosNivel = totalPerguntasNivel - pontuacaoNivel;

    historicoNiveis.push({
        nivel: nivelAtual,
        nome: nomesNiveis[nivelAtual],
        acertos: pontuacaoNivel,
        erros: errosNivel,
        total: totalPerguntasNivel
    });

    document.getElementById("tela-final").classList.remove("hidden");
    
    const subtitulo = document.getElementById("subtitulo-nivel-final");
    const titulo = document.getElementById("resultado-titulo");
    const texto = document.getElementById("resultado-texto");
    const icone = document.getElementById("resultado-icone");
    const btnAcao = document.getElementById("btn-acao-final");
    const resumoGeral = document.getElementById("resumo-geral-niveis");
    const listaDesempenho = document.getElementById("lista-desempenho-niveis");

    if (nivelAtual < 3) {
        resumoGeral.classList.add("hidden");
        subtitulo.innerText = nomesNiveis[nivelAtual];
        document.getElementById("pontuacao-final").innerText = pontuacaoNivel;
        document.getElementById("total-final").innerText = totalPerguntasNivel;

        const aproveitamento = pontuacaoNivel / totalPerguntasNivel;
        definirEstiloResultado(aproveitamento, titulo, icone);

        texto.innerText = `Você concluiu o ${nomesNiveis[nivelAtual]}. Prepare-se para mensagens mais sutis na próxima etapa.`;
        btnAcao.innerText = `Avançar para o Nível ${nivelAtual + 1}`;
    } else {
        resumoGeral.classList.remove("hidden");
        subtitulo.innerText = "Resultado Final Completo";
        
        const totalGeralCenarios = historicoNiveis.reduce((acc, item) => acc + item.total, 0);
        document.getElementById("pontuacao-final").innerText = pontuacaoTotalGeral;
        document.getElementById("total-final").innerText = totalGeralCenarios;

        const aproveitamentoGeral = pontuacaoTotalGeral / totalGeralCenarios;
        definirEstiloResultado(aproveitamentoGeral, titulo, icone);

        texto.innerText = "Parabéns por concluir todas as etapas do treinamento! Confira seu desempenho detalhado:";
        btnAcao.innerText = "Reiniciar Treinamento Completo";

        listaDesempenho.innerHTML = "";
        historicoNiveis.forEach(item => {
            const linha = document.createElement("div");
            linha.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: #ffffff; border-radius: 8px; border: 1px solid #e9edef;";
            linha.innerHTML = `
                <span style="font-weight: 600; color: #111b21;">${item.nome}</span>
                <span>
                    <strong style="color: #22c55e;">✅ ${item.acertos}</strong> &nbsp;|&nbsp; 
                    <strong style="color: #ef4444;">❌ ${item.erros}</strong>
                </span>
            `;
            listaDesempenho.appendChild(linha);
        });
    }

    const refContainer = document.getElementById("referencias-container");
    const listaRef = document.getElementById("lista-referencias");
    
    if (refContainer && listaRef) {
        refContainer.classList.remove("hidden");
        listaRef.innerHTML = "";
        
        const linksUnicos = [];
        perguntasDaPartida.forEach(pergunta => {
            const refExistente = linksUnicos.find(link => link.url === pergunta.referenciaLink);
            if (!refExistente && pergunta.referenciaLink) {
                linksUnicos.push({ titulo: pergunta.referenciaTitulo, url: pergunta.referenciaLink });
            }
        });

        linksUnicos.forEach(ref => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${ref.url}" target="_blank" style="text-decoration: none; color: #008069; display: flex; align-items: flex-start; gap: 6px;"><i class="fa-solid fa-arrow-up-right-from-square" style="margin-top: 3px; font-size: 11px;"></i> <span>${ref.titulo}</span></a>`;
            listaRef.appendChild(li);
        });
    }
}

function definirEstiloResultado(aproveitamento, titulo, icone) {
    if (aproveitamento === 1) {
        titulo.innerText = "Detetive Impecável!";
        titulo.style.color = "#008069";
        icone.style.backgroundColor = "#008069";
    } else if (aproveitamento >= 0.6) {
        titulo.innerText = "Cidadão Atento!";
        titulo.style.color = "#eab308";
        icone.style.backgroundColor = "#eab308";
    } else {
        titulo.innerText = "Atenção Redobrada!";
        titulo.style.color = "#ef4444";
        icone.style.backgroundColor = "#ef4444";
    }
}

function avancarOuReiniciar() {
    document.getElementById("tela-final").classList.add("hidden");
    
    if (nivelAtual < 3) {
        nivelAtual++;
        iniciarNivel(nivelAtual);
    } else {
        nivelAtual = 1;
        pontuacaoTotalGeral = 0;
        historicoNiveis = [];
        iniciarNivel(nivelAtual);
    }
}