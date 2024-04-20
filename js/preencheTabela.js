import { Pokemon } from "./Pokemon.js";
const tabela = document.getElementById("pokeTabela");

async function carregaTabela(inicio, final) {
    for (let index = inicio; index < final; index++) {
        let pokeObj = await buscaInfo(index);
        await geraCard(pokeObj);
        localStorage.setItem(pokeObj.id.toString(), JSON.stringify(pokeObj));
    }
    let ultimoPoke = tabela.lastChild;
    let vigiaPoke = new IntersectionObserver(([fimTabela], obervador) => {
        if (fimTabela.isIntersecting) {
            obervador.unobserve(fimTabela.target);
            carregaTabela(final, final * 2);
        }
    });
    vigiaPoke.observe(ultimoPoke);
}

async function buscaInfo(id) {
    let pokeExiste = JSON.parse(localStorage.getItem(id)) ;
    if(pokeExiste!= null){
        return pokeExiste;
    }else{
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/" + id,
                success: async function (result) {
                    let pokeObj = new Pokemon(
                        result.id,
                        result.name,
                        result.stats,
                        result.types,
                        result.sprites.front_default,
                        result.weight,
                        result.height,
                        result.abilities
                    );
                    resolve(pokeObj);
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    }
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
    pokeCard.setAttribute("href", "adcionar link aq");

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
document.addEventListener("DOMContentLoaded", function () {
    carregaTabela(1, 50);
});
