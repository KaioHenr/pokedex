const tabela = document.getElementById("pokeTabela");
carregaNomes();
const pokeListaNomes = JSON.parse(localStorage.getItem("pokeNomeList"));
let pokemonsAdicionados = new Set();

async function carregaTabela(inicio, final) {
    for (let index = inicio; index <= final; index++) {
        let pokeObj = await buscaInfo(index);
        await geraCard(pokeObj);
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

async function geraCard(pokemon) {
    if (pokemonsAdicionados.has(pokemon.id)) {
        return;
    }
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
    pokeCard.setAttribute("href", "./especificao_pokemon/index.html?idPoke=" + pokemon.id)

    pokeImg.setAttribute("src", pokemon.img);
    pokeImg.setAttribute("class", "pokeImg");
    pokeImg.alt = pokemon.nome;

    pokeNome.innerHTML = pokemon.nome;
    pokeId.innerHTML = pokemon.id;
    pokemon.tipos.forEach((tipo) => {
        pokeTipo.innerHTML += tipo + " ";
    });

    let pokeAnterior = document.getElementById(pokemon.id - 1);
    if (pokeAnterior != null) {
        pokeAnterior.parentElement.insertBefore(
            pokeCard,
            pokeAnterior.nextSibling
        );
    } else {
        tabela.appendChild(pokeCard);
    }
    pokemonsAdicionados.add(pokemon.id);
}

document.addEventListener("DOMContentLoaded", async function () {
    await carregaTabela(1, 25);
    let input = document.getElementById("pokeBusca");
    input.addEventListener("input", async function () {
        let value = input.value.trim().toLowerCase();
        if (value != "" && value != null && isNaN(value)) {
            let pokePromises = pokeListaNomes.map(async (lst) => {
                if (lst.toLowerCase().includes(value)) {
                    let aux = await buscaInfo(lst);
                    return aux;
                }
            });
            let pokeResults = await Promise.all(pokePromises);
            pokeResults = pokeResults.filter(function (element) {
                return element != undefined;
            });
            pokeResults.forEach((pokePesquisado) => {
                if (!document.getElementById(pokePesquisado.id)) {
                    geraCard(pokePesquisado);
                }
            });
            Array.from(document.getElementsByClassName("pokeCard")).forEach(
                (element) => {
                    let id = parseInt(element.getAttribute("id"));
                    if (!pokeResults.some((poke) => poke.id === id)) {
                        element.style.display = "none";
                    } else {
                        element.style.display = "flex";
                    }
                }
            );
        } else if (value == "" || value == null) {
            let pokeCards = document.getElementsByClassName("pokeCard");
            Array.from(pokeCards).forEach((element) => {
                element.style.display = "flex";
            });
        } else if (!isNaN(Number(value))) {
            let id = parseInt(value);
            try {
                let pokeResult = await buscaInfo(id); // Aguarda a resolução da promessa
                if (!document.getElementById(pokeResult.id)) {
                    geraCard(pokeResult);
                }
                let pokeCard = document.getElementById(id.toString());
                if (pokeCard) {
                    pokeCard.style.display = "flex";
                }
                let pokeCards = document.getElementsByClassName("pokeCard");
                Array.from(pokeCards).forEach((element) => {
                    let cardId = parseInt(element.getAttribute("id"));
                    if (cardId !== id) {
                        element.style.display = "none";
                    }
                });
            } catch (error) {
                console.error("Erro ao buscar informações do Pokémon:", error);
            }
        }
    });
});

function carregaNomes() {
    let pokeNomeList = JSON.parse(localStorage.getItem("pokeNomeList"));
    if (pokeNomeList != null) {
        return pokeNomeList;
    } else {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/?limit=1025",
                success: function (response) {
                    let lstNames = [];
                    for (
                        let index = 0;
                        index < response.results.length;
                        index++
                    ) {
                        lstNames.push(response.results[index].name);
                    }
                    localStorage.setItem(
                        "pokeNomeList",
                        JSON.stringify(lstNames)
                    );
                },
            });
        });
    }
}
