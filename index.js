// Passo 1 -> Saber qnd o Botão foi clicado
// Passo 2 -> Pegar o que está dentro do INPUT
// Passo 3 -> Ir no Servidor (OperWeather) e pegar as info. do tempo atualizadas
// Passo 4 -> Organizar as info. que chegaram
// Passo 5 -> Colocar as info. na tela

let chave = 'cebcd482eda57fa9a6714c1c2ba91885'

function colocarNaTela(dados) {
    console.log(dados)

    document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name
    document.querySelector(".tempo").innerHTML = Math.floor(dados.main.temp) + "°C"
    document.querySelector(".icone").src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png"
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%"

    // innerHTML serve para TROCAR O TEXTO do HTML
    // Math.floor -> Ferramenta do Js para arredondar valores
}

async function buscarCidade(cidade) {

    let dados = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cidade + "&appid=cebcd482eda57fa9a6714c1c2ba91885&units=metric").then(resposta => resposta.json())

    // await = ESPERE
    // fetch = Ferramenta do Js para acessar servidores 
    // then = ENTÃO]
    // json = JAVASCRIPT OBJECT NOTATTION (O formato que o Js entende)


    colocarNaTela(dados)
}

function cliqueiNoBotao() {
    let cidade = document.querySelector(".input-cidade").value
    // querySelector serve para eu PEGAR alguma coisa do HTML

    buscarCidade(cidade)
}

/*
CLICA NO BOTÃO
    -> CHAMA A FUNÇÃO cliqueiNoBotão()
    -> Vai no INPUT e pega o que está lá dentro
    -> PASSAR a cidade para o servidor

    Math.floor -> Ferramenta do Js para arredondar valores

    Para aplicar o projeto na internet(tornar dele num site), usa-se NETLIFY DROP
*/
