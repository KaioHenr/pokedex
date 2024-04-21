async function buscaInfo(id) {
    let pokeExiste = JSON.parse(localStorage.getItem(id));
    if (pokeExiste != null) {
        return pokeExiste;
    } else {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/" + id,
                success: async function (result) {
                    let base_stats = 0;
                    let status = {};
                    let tipos = [];
                    let habilidades = [];

                    result.stats.forEach((stato) => {
                        base_stats += stato.base_stat;
                        status[stato.stat.name] = stato.base_stat;
                    }); //populando status

                    result.types.forEach((tipo) => {
                        tipos.push(tipo.type.name);
                    }); //populando tipo

                    result.abilities.forEach((habilidade) => {
                        habilidades.push(habilidade.ability.name);
                    }); //populando habilidades
                    let pokeObj = {
                        id: result.id,
                        nome: result.name,
                        img: result.sprites.front_default,
                        peso: result.weight,
                        altura: result.height,
                        status: status,
                        base_stats: base_stats,
                        tipos: tipos,
                        habilidades: habilidades,
                    };
                    localStorage.setItem(
                        pokeObj.nome.toString(),
                        JSON.stringify(pokeObj)
                    );
                    localStorage.setItem(
                        pokeObj.id.toString(),
                        JSON.stringify(pokeObj)
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

function carregaNomes() {
    let pokeNomeList = JSON.parse(localStorage.getItem("pokeNomeList"));
    // if (pokeNomeList != null) {
    if (false) {
        return pokeNomeList;
    } else {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/?limit=1025",
                success: function (response) {
                    let lstNames = [];
                    for (let index = 0; index < response.results.length; index++) {
                        lstNames.push(response.results[index].name);
                    }
                    localStorage.setItem("pokeNomeList",JSON.stringify(lstNames));
                }
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let buscarButton = document.getElementById("buscarButton");
    buscarButton.addEventListener("click", (e) => {
        let inputBusca = document.getElementById("pokeBusca").value;
        if (inputBusca) {
            $.get(
                "./especificao_pokemon/index.php",
                { idPoke: inputBusca },
                function (result) {
                    console.log("oi");
                }
            );
        } else {
            window.alert("deu ruim");
        }
    });
});
