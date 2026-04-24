// Chave da API utilizada para as requisições
let chave = '9718161ba03c5b28d7af252b78fea3b7'

// Controla a exibição do Spinner ou da Lupa no botão de busca
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

// Atualiza os elementos da interface com os dados meteorológicos recebidos
function exibirResultado(dados) {
    if (dados.cod === "404") {
        document.querySelector(".cidade").innerHTML = "Cidade não encontrada"
        document.querySelector(".tempo").innerHTML = ""
        document.querySelector(".umidade").innerHTML = ""
        document.querySelector(".icone").src = ""
        carregarBusca(false)
        return
    }

    document.querySelector(".cidade").innerHTML = "Tempo em " + dados.localizacaoCompleta
    document.querySelector(".tempo").innerHTML = Math.floor(dados.main.temp) + "°C"
    document.querySelector(".icone").src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png"
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%"

    const urlFundo = `https://unsplash.it/1600/900?${dados.name.replace(/\s/g, '')}`
    document.body.style.backgroundImage = `url('${urlFundo}')`

    carregarBusca(false)
}

// Realiza a busca de coordenadas geográficas e, em seguida, do clima atual
async function buscarCidade(cidade) {
    carregarBusca(true) 
    
    try {
        // A API de Geocoding interpreta strings complexas, incluindo siglas de estados e países
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cidade)}&limit=1&appid=${chave}`
        const geoResposta = await fetch(geoUrl)
        const geoDados = await geoResposta.json()

        if (!geoDados || geoDados.length === 0) {
            document.querySelector(".cidade").innerHTML = "Local não encontrado"
            document.querySelector(".tempo").innerHTML = ""
            document.querySelector(".umidade").innerHTML = ""
            document.querySelector(".icone").src = ""
            carregarBusca(false)
            return
        }

        const { lat, lon, state, country, name } = geoDados[0]

        // Busca os dados climáticos utilizando latitude e longitude para precisão máxima
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${chave}&lang=pt_br&units=metric`
        const resposta = await fetch(weatherUrl)
        const dados = await resposta.json()

        // Formatação da localização com base nos dados geográficos retornados
        dados.localizacaoCompleta = `${name}${state ? ', ' + state : ''}, ${country}`

        exibirResultado(dados)
    } catch (erro) {
        console.error("Erro na busca:", erro)
        alert("Erro na conexão ou chave da API.")
        carregarBusca(false)
    }
}

// Captura a entrada do usuário e inicia o fluxo de busca
function iniciarBusca() {
    let cidade = document.querySelector(".input-cidade").value.trim()

    if (!cidade) {
        alert("Digite o nome de uma cidade!")
        return
    }

    buscarCidade(cidade)
}

document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        iniciarBusca()
    }
})
