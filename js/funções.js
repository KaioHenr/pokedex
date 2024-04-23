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

async function ComparaRecebe1() {
    let pokeListaNomes = JSON.parse(localStorage.getItem("pokeNomeList"));
    const idPoke = new URL(window.location.href).searchParams.get("idPoke");
    const pokePesquisado = await buscaInfo(parseInt(idPoke));
    if (pokeListaNomes == null) {
        pokeListaNomes = carregaNomes();
    }
    await Swal.fire({
        title: "Selecione o Pokémon para comparar com o " + pokePesquisado.nome,
        input: "select",
        inputOptions: pokeListaNomes,
        showCancelButton: true,
    }).then(async (segundoResult) => {
        let pokeSelecionado = await buscaInfo(
            pokeListaNomes[segundoResult.value]
        );
        if (pokePesquisado.id == pokeSelecionado.id) {
            Swal.fire("Escolheu o mesmo pokemon!!");
        } else if (pokePesquisado.base_stats > pokeSelecionado.base_stats) {
            Swal.fire(
                pokePesquisado.nome +
                    " e mais forte com " +
                    parseInt(
                        pokePesquisado.base_stats - pokeSelecionado.base_stats
                    ) +
                    " pontos de status a mais!!"
            );
        } else if (pokePesquisado.base_stats == pokeSelecionado.base_stats) {
            Swal.fire(
                pokePesquisado.nome +
                    " tem a mesma quantidade de status que " +
                    pokeSelecionado.nome
            );
        } else {
            Swal.fire(
                pokeSelecionado.nome +
                    " e mais forte com " +
                    parseInt(
                        pokeSelecionado.base_stats - pokePesquisado.base_stats
                    ) +
                    " pontos de status a mais!!"
            );
        }
    });
}
async function comparaRecebe2() {
    await Swal.fire({
        title: "Selecione os Pokémon para comparar",
        icon: "question",
        input: "select",
        inputPlaceholder: "Selecione o primeiro Pokémon",
        inputOptions: pokeListaNomes,
        inputAttributes: {
            autocapitalize: "off",
        },
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Próximo",
        allowOutsideClick: false,
    }).then(async (primeiroResult) => {
        if (primeiroResult.isConfirmed) {
            let primeiroPokemon = await buscaInfo(
                pokeListaNomes[primeiroResult.value]
            );
            await Swal.fire({
                title: "Selecione o segundo Pokémon",
                html:
                    "<div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
                    primeiroPokemon.img +
                    "'/> <img src='../img/vs.svg'/> <img src='../img/interrogacao.svg' style='width: 100px;'/></div>",
                input: "select",
                inputPlaceholder: "Selecione o segundo Pokémon",
                inputOptions: pokeListaNomes,
                inputAttributes: {
                    autocapitalize: "off",
                },
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Comparar",
                allowOutsideClick: false,
            }).then(async (segundoResult) => {
                if (segundoResult.isConfirmed) {
                    let segundoPokemon = await buscaInfo(
                        pokeListaNomes[segundoResult.value]
                    );
                    if (primeiroPokemon.id == segundoPokemon.id) {
                        Swal.fire("Escolheu o mesmo pokemon!!");
                    } else if (
                        primeiroPokemon.base_stats > segundoPokemon.base_stats
                    ) {
                        Swal.fire(
                            primeiroPokemon.nome +
                                " e mais forte com " +
                                parseInt(
                                    primeiroPokemon.base_stats -
                                        segundoPokemon.base_stats
                                ) +
                                " pontos de status a mais!!"
                        );
                    } else if (
                        primeiroPokemon.base_stats == segundoPokemon.base_stats
                    ) {
                        Swal.fire(
                            primeiroPokemon.nome +
                                " tem a mesma quantidade de status que " +
                                segundoPokemon.nome
                        );
                    } else {
                        Swal.fire(
                            segundoPokemon.nome +
                                " e mais forte com " +
                                parseInt(
                                    segundoPokemon.base_stats -
                                        primeiroPokemon.base_stats
                                ) +
                                " pontos de status a mais!!"
                        );
                    }
                }
            });
        }
    });
}
