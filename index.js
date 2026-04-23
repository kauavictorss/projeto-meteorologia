// Passo 1 -> Saber quando o Botão foi clicado
// Passo 2 -> Pegar o que está dentro do ‘INPUT’
// Passo 3 -> Ir no servidor (OperWeather) e pegar as info. do tempo atualizadas
// Passo 4 -> Organizar as infos que chegaram
// Passo 5 -> Colocar as infos na tela

let chave = '9718161ba03c5b28d7af252b78fea3b7'

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

function exibirResultado(dados) {
    if (dados.cod === "404") {
        document.querySelector(".cidade").innerHTML = "Cidade não encontrada"
        document.querySelector(".tempo").innerHTML = ""
        document.querySelector(".umidade").innerHTML = ""
        document.querySelector(".icone").src = ""
        carregarBusca(false)
        return
    }

    const imgFundo = new Image()
    const urlFundo = `https://unsplash.it/1600/900?${dados.name.replace(/\s/g, '')}`
    imgFundo.src = urlFundo

    imgFundo.onload = () => {
        document.body.style.backgroundImage = `url('${urlFundo}')`

        document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name
        document.querySelector(".tempo").innerHTML = Math.floor(dados.main.temp) + "°C"
        document.querySelector(".icone").src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png"
        document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%"

        carregarBusca(false)
    }

    imgFundo.onerror = () => {
        // Se a imagem falhar, mostramos os dados mesmo assim e paramos o spinner
        carregarBusca(false)
        document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name
        // ... (restante do código de exibição)
    }
}

async function buscarCidade(cidade) {
    carregarBusca(true) // Inicia o spinner

    try {
        const resposta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${chave}&units=metric`)
        const dados = await resposta.json()

        if (resposta.status === 401) {
            alert("Erro 401: A chave da API foi recusada.")
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

function buscarDados() {
    let cidade = document.querySelector(".input-cidade").value

    if (!cidade) {
        alert("Digite o nome de uma cidade!")
        return
    }

    buscarCidade(cidade)
}

// Adiciona evento para pesquisar ao apertar Enter
document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        buscarDados()
    }
})

/*
CLICA NO BOTÃO
    -> CHAMA A FUNÇÃO buscarDados()
    -> Vai no INPUT e pega o que está lá dentro
    -> PASSAR a cidade para o servidor

    Math.floor -> Ferramenta do Js para arredondar valores

    Para aplicar o projeto à internet (tornar uma aplicação web), usa-se NETLIFY DROP ou github pages
*/
