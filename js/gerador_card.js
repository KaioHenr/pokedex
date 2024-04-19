function geraCard(array) {
    let pokeCard = document.createElement("div");
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
    pokeCard.setAttribute("id", array[0]);

    pokeImg.setAttribute(
        "src",
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
            array[0] +
            ".png"
    );
    pokeImg.setAttribute("class", "pokeImg");
    pokeImg.alt = array[1];

    pokeNome.innerHTML = array[1];
    pokeId.innerHTML = array[0];
    array[3].forEach(tipo => {
        pokeTipo.innerHTML += tipo.type.name + " ";
    });
    console.log(array);
    //retirar linha abaixo
    document.getElementById("pokeTabela").appendChild(pokeCard);

    return pokeCard;
}
function buscaInfo() {
    for (let index = 1; index < 30; index++) {
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + index + "/",
            success: function (result) {
                console.log(result);
                let base_stats = 0;
                result.stats.forEach((stats) => {
                    base_stats += stats.base_stat;
                });
                let pokeArray = [result.id, result.name, base_stats, result.types];
                geraCard(pokeArray);
            },
        });
    }
}
buscaInfo();
