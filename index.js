// Chave da API
let chave = '9718161ba03c5b28d7af252b78fea3b7'

// Função que controla o visual do carregamento (Spinner vs Lupa)
function carregarBusca(carregando) {
    const lupa = document.querySelector(".lupa")
    const spinner = document.querySelector("#spinner")
    
    if (carregando) {
        lupa.classList.add("d-none")
        spinner.classList.remove("d-none")
    } else {
        lupa.classList.remove("d-none")
        spinner.classList.add("d-none")
    }
}

// Função que coloca os dados na tela e troca o fundo
function exibirResultado(dados) {
    if (dados.cod === "404") {
        document.querySelector(".cidade").innerHTML = "Cidade não encontrada"
        document.querySelector(".tempo").innerHTML = ""
        document.querySelector(".umidade").innerHTML = ""
        document.querySelector(".icone").src = ""
        carregarBusca(false)
        return
    }

    // 1. ATUALIZAÇÃO IMEDIATA: O usuário recebe a temperatura instantaneamente
    document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name
    document.querySelector(".tempo").innerHTML = Math.floor(dados.main.temp) + "°C"
    document.querySelector(".icone").src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png"
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%"

    // 2. FUNDO EM SEGUNDO PLANO: A imagem começa a carregar sem travar os dados
    const urlFundo = `https://unsplash.it/1600/900?${dados.name.replace(/\s/g, '')}`
    document.body.style.backgroundImage = `url('${urlFundo}')`

    // 3. FINALIZAÇÃO: O spinner para porque a tarefa principal foi concluída
    carregarBusca(false)
}

// Função que vai no servidor buscar a temperatura
async function buscarCidade(cidade) {
    carregarBusca(true) 
    
    try {
        // Adicionado &lang=pt_br para melhorar a precisão em português
        const resposta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${chave}&lang=pt_br&units=metric`)
        const dados = await resposta.json()

        if (resposta.status === 401) {
            alert("Erro 401: Chave da API recusada ou ainda não ativada.")
            carregarBusca(false)
            return
        }

        exibirResultado(dados)
    } catch (erro) {
        console.error("Erro na busca:", erro)
        alert("Ocorreu um erro ao tentar buscar os dados.")
        carregarBusca(false)
    }
}

// Função que pega o nome da cidade no input (Refatorada)
function iniciarBusca() {
    let cidade = document.querySelector(".input-cidade").value.trim() // .trim() remove espaços inúteis no início/fim

    if (!cidade) {
        alert("Digite o nome de uma cidade!")
        return
    }

    buscarCidade(cidade)
}

// Atalho da tecla Enter
document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        iniciarBusca()
    }
})
