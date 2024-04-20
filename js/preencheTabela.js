import { Pokemon } from "./Pokemon.js"; 

const tabela = document.getElementById("pokeTabela");

async function buscaPoke() {
    let input = document.getElementById("pokeBusca");
    if (input.value != "") {
        await buscaInfo(input.value);
    } else {
        window.alert("tu n colocou pokemon nenhum no input seu safado");
    }
}

async function carregaTabela(inicio, final) {
    for (let index = inicio; index < final; index++) {
        await buscaInfo(index);
    }
    let ultimoPoke = tabela.lastChild;
    let vigiaPoke = new IntersectionObserver(([fimTabela],obervador)=> {
        if(fimTabela.isIntersecting){
            obervador.unobserve(fimTabela.target);
            carregaTabela(final, final*2)
        }
    })
    vigiaPoke.observe(ultimoPoke);
}

async function buscaInfo(id) {
    await $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + id,
        success: async function (result) {
            let base_stats = 0;
            result.stats.forEach((stats) => {
                base_stats += stats.base_stat;
            });
            let pokeObj = new Pokemon(result.id,result.name,result.stats,result.types, result.sprites.front_default, result.weight, result.height, result.abilities);
            await geraCard(pokeObj);
        },
    });
}

async function geraCard(pokemon) {
    let pokeCard = document.createElement("a");
    let pokeImg = document.createElement("img");
    let pokeInfo = document.createElement("div");
    let pokeNome = document.createElement("h3");
    let pokeId = document.createElement("h4");
    let pokeTipo = document.createElement("h5");

    pokeInfo.appendChild(pokeNome);
    pokeInfo.appendChild(pokeId);
    pokeInfo.appendChild(pokeTipo);

    pokeCard.appendChild(pokeImg);
    pokeCard.appendChild(pokeInfo);

    pokeCard.setAttribute("class", "pokeCard");
    pokeCard.setAttribute("id", pokemon.id);
    pokeCard.setAttribute("href", 'adcionar link aq');

    pokeImg.setAttribute("src", pokemon.img);
    pokeImg.setAttribute("class", "pokeImg");
    pokeImg.alt = pokemon.nome;

    pokeNome.innerHTML = pokemon.nome;
    pokeId.innerHTML = pokemon.id;
    pokemon.tipos.forEach((tipo) => {
        pokeTipo.innerHTML += tipo + " ";
    });

    tabela.appendChild(pokeCard);
}
document.addEventListener("DOMContentLoaded", function() {
    const buscarButton = document.getElementById("buscarButton");
    buscarButton.addEventListener("click", buscaPoke);
});
document.addEventListener("DOMContentLoaded", carregaTabela(1,50));