const colors = {
    normal: "#a8a77a",
    fire: "#ee8130",
    water: "#6390f0",
    electric: "#f7d02c",
    grass: "#7ac74c",
    ice: "#96d9d6",
    fighting: "#c22e28",
    poison: "#a33ea1",
    ground: "#e2bf65",
    flying: "#a98ff3",
    psychic: "#f95587",
    bug: "#a6b91a",
    rock: "#b6a136",
    ghost: "#735797",
    dragon: "#6f35fc",
    dark: "#705746",
    steel: "#b7b7ce",
    fairy: "#d685ad",
};
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
                    resolve(lstNames);
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    }
}

// async function ComparaRecebe1() {
//     let pokeListaNomes = await carregaNomes();
//     const idPoke = new URL(window.location.href).searchParams.get("idPoke");
//     const pokePesquisado = await buscaInfo(parseInt(idPoke));

//     await Swal.fire({
//         title: "Selecione o Pokémon para comparar com o " + pokePesquisado.nome,
//         html:"<div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
//         pokePesquisado.img +
//         "'/> <img src='../img/vs.svg'/> <img src='../img/interrogacao.svg' style='width: 100px;'/></div>",
//         input: "select",
//         inputOptions: pokeListaNomes,
//         showCancelButton: true,
//     }).then(async (segundoResult) => {
//         let pokeSelecionado = await buscaInfo(
//             pokeListaNomes[segundoResult.value]
//         );
//         if (pokePesquisado.id == pokeSelecionado.id) {
//             Swal.fire({
//                 title: "Você escolheu o mesmo Pokémon!!!",
//                 html:
//                     "<div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
//                     pokePesquisado.img +
//                     "'/> <img src='../img/vs.svg'/> <div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
//                     pokeSelecionado.img +
//                     "'/>",
//             });
//         } else if (pokePesquisado.base_stats > pokeSelecionado.base_stats) {
//             Swal.fire({
//                 title: pokePesquisado.nome + " e mais forte💪💪",
//                 html:
//                     "<div style='display: flex; justify-content: center;flex-direction: column;'><div style='display: flex;gap: 20px;'><img src='" +
//                     pokePesquisado.img +
//                     "' alt='' style = 'width: 150px;' /><img src='../img/maior-que.svg' alt='sinal' style = 'width: 100px;' /><img src='" +
//                     pokeSelecionado.img +
//                     "' alt='' style = 'width: 150px;' /></div><h1>" +
//                     parseInt(
//                         pokePesquisado.base_stats -
//                         pokeSelecionado.base_stats
//                     ) +
//                     " pontos de status a mais!!</h1></div>",
//             });
//         } else if (pokePesquisado.base_stats == pokeSelecionado.base_stats) {
//             Swal.fire({
//                 title:
//                 pokePesquisado.nome +
//                     " tem a mesma quantidade de status que " +
//                     pokeSelecionado.nome,
//                 html:
//                     "<div style='display: flex; justify-content: center;flex-direction: column;'><div style='display: flex;gap: 20px;'><img src='" +
//                     pokePesquisado.img +
//                     "' alt='' style = 'width: 150px;' /><img src='../img/igual.svg' alt='sinal' style = 'width: 100px;' /><img src='" +
//                     pokeSelecionado.img +
//                     "' alt='' style = 'width: 150px;' /></div></div>",
//             });
//         } else {
//             Swal.fire({
//                 title: pokeSelecionado.nome + " e mais forte💪💪",
//                 html:
//                     "<div style='display: flex; justify-content: center;flex-direction: column;'><div style='display: flex;gap: 20px;'><img src='" +
//                     pokeSelecionado.img +
//                     "' alt='' style = 'width: 150px;' /><img src='img/maior-que.svg' alt='sinal' style = 'width: 100px;' /><img src='" +
//                     pokePesquisado.img +
//                     "' alt='' style = 'width: 150px;' /></div><h1>" +
//                     parseInt(
//                         pokePesquisado.base_stats -
//                         pokeSelecionado.base_stats
//                     )*(-1) +
//                     " pontos de status a mais!!</h1></div>",
//             });
//         }
//     });
// }
// async function comparaRecebe2() {
//     await Swal.fire({
//         title: "Selecione os Pokémon para comparar",
//         icon: "question",
//         input: "select",
//         inputPlaceholder: "Selecione o primeiro Pokémon",
//         inputOptions: pokeListaNomes,
//         inputAttributes: {
//             autocapitalize: "off",
//         },
//         showCancelButton: true,
//         cancelButtonText: "Cancelar",
//         confirmButtonText: "Próximo",
//         allowOutsideClick: false,
//     }).then(async (primeiroResult) => {
//         if (primeiroResult.isConfirmed) {
//             let primeiroPokemon = await buscaInfo(
//                 pokeListaNomes[primeiroResult.value]
//             );
//             await Swal.fire({
//                 title: "Selecione o segundo Pokémon",
//                 html:
//                     "<div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
//                     primeiroPokemon.img +
//                     "' style = 'width: 150px;'/> <img src='img/vs.svg' style = 'width: 100px;'/> <img src='img/interrogacao.svg' style = 'width: 100px;'/></div>",
//                 input: "select",
//                 inputPlaceholder: "Selecione o segundo Pokémon",
//                 inputOptions: pokeListaNomes,
//                 inputAttributes: {
//                     autocapitalize: "off",
//                 },
//                 showCancelButton: true,
//                 cancelButtonText: "Cancelar",
//                 confirmButtonText: "Comparar",
//                 allowOutsideClick: false,
//             }).then(async (segundoResult) => {
//                 if (segundoResult.isConfirmed) {
//                     let segundoPokemon = await buscaInfo(
//                         pokeListaNomes[segundoResult.value]
//                     );
//                     if (primeiroPokemon.id == segundoPokemon.id) {
//                         Swal.fire({
//                             title: "Você escolheu o mesmo Pokémon!!!",
//                             html:
//                                 "<div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
//                                 primeiroPokemon.img +
//                                 "' style = 'width: 150px;'/> <img src='img/vs.svg' style = 'width: 100px;'/> <div style='display: flex; justify-content: space-around; align-items: center;'><img src='" +
//                                 segundoPokemon.img +
//                                 "' style = 'width: 150px;'/>",
//                         });
//                     } else if (
//                         primeiroPokemon.base_stats > segundoPokemon.base_stats
//                     ) {
//                         Swal.fire({
//                             title: primeiroPokemon.nome + " e mais forte💪💪",
//                             html:
//                                 "<div style='display: flex; justify-content: center;flex-direction: column;'><div style='display: flex;gap: 20px;'><img src='" +
//                                 primeiroPokemon.img +
//                                 "' alt='' style = 'width: 150px;' /><img src='img/maior-que.svg' alt='sinal' style = 'width: 100px;' /><img src='" +
//                                 segundoPokemon.img +
//                                 "' alt='' style = 'width: 150px;' /></div><h1>" +
//                                 parseInt(
//                                     primeiroPokemon.base_stats -
//                                         segundoPokemon.base_stats
//                                 ) +
//                                 " pontos de status a mais!!</h1></div>",
//                         });
//                     } else if (
//                         primeiroPokemon.base_stats == segundoPokemon.base_stats
//                     ) {
//                         Swal.fire({
//                             title:
//                                 primeiroPokemon.nome +
//                                 " tem a mesma quantidade de status que " +
//                                 segundoPokemon.nome,
//                             html:
//                                 "<div style='display: flex; justify-content: center;flex-direction: column;'><div style='display: flex;gap: 20px;'><img src='" +
//                                 segundoPokemon.img +
//                                 "' alt='' style = 'width: 150px;' /><img src='img/igual.svg' alt='sinal' style = 'width: 100px;' /><img src='" +
//                                 primeiroPokemon.img +
//                                 "' alt='' style = 'width: 150px;' /></div></div>",
//                         });
//                     } else {
//                         Swal.fire({
//                             title: segundoPokemon.nome + " e mais forte💪💪",
//                             html:
//                                 "<div style='display: flex; justify-content: center;flex-direction: column;'><div style='display: flex;gap: 20px;'><img src='" +
//                                 segundoPokemon.img +
//                                 "' alt='' style = 'width: 150px;' /><img src='img/maior-que.svg' alt='sinal' style = 'width: 100px;' /><img src='" +
//                                 primeiroPokemon.img +
//                                 "' alt='' style = 'width: 150px;' /></div><h1>" +
//                                 parseInt(
//                                     primeiroPokemon.base_stats -
//                                         segundoPokemon.base_stats
//                                 ) *
//                                     -1 +
//                                 " pontos de status a mais!!</h1></div>",
//                         });
//                     }
//                 }
//             });
//         }
//     });
// }
async function compararPokemon(pokemon1, pokemon2) {
    let titulo;
    let mensagem;

    if (pokemon1.id === pokemon2.id) {
        return Swal.fire({
            titulo: "Você escolheu o mesmo Pokémon!!!",
            html: `
                <div style="display: flex; justify-content: space-around; align-items: center;">
                    <img src="${pokemon1.img}" style="width: 150px;"/>
                    <img src="../img/vs.svg" style="width: 100px;"/>
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <img src="${pokemon2.img}" style="width: 150px;"/>
                    </div>
                </div>`,
        });
    }

    if (pokemon1.base_stats > pokemon2.base_stats) {
        titulo = `${pokemon1.nome} é mais forte 💪💪`;
    } else if (pokemon1.base_stats === pokemon2.base_stats) {
        titulo = `${pokemon1.nome} tem a mesma quantidade de status que ${pokemon2.nome}`;
    } else {
        titulo = `${pokemon2.nome} é mais forte 💪💪`;
    }
    if (pokemon1.base_stats > pokemon2.base_stats) {
        mensagem = `
                    <div style="display: flex; justify-content: center;flex-direction: column;">
                        <div style="display: flex;gap: 20px;">
                            <img src="${
                                pokemon1.img
                            }" alt="" style="width: 150px;"/>
                            <img src="../img/maior-que.svg" alt="sinal" style="width: 100px;"/>
                            <img src="${
                                pokemon2.img
                            }" alt="" style="width: 150px;"/>
                        </div>
                        <h1>${Math.abs(
                            pokemon1.base_stats - pokemon2.base_stats
                        )} pontos de status a mais!!</h1>
                    </div>`;
    } else if (pokemon1.base_stats === pokemon2.base_stats) {
        mensagem = `
                    <div style="display: flex; justify-content: center;flex-direction: column;">
                        <div style="display: flex;gap: 20px;">
                            <img src="${pokemon1.img}" alt="" style="width: 150px;"/>
                            <img src="../img/igual.svg" alt="sinal" style="width: 100px;"/>
                            <img src="${pokemon2.img}" alt="" style="width: 150px;"/>
                        </div>
                    </div>`;
    } else {
        mensagem = `
                    <div style="display: flex; justify-content: center;flex-direction: column;">
                        <div style="display: flex;gap: 20px;">
                            <img src="${
                                pokemon2.img
                            }" alt="" style="width: 150px;"/>
                            <img src="../img/maior-que.svg" alt="sinal" style="width: 100px;"/>
                            <img src="${
                                pokemon1.img
                            }" alt="" style="width: 150px;"/>
                        </div>
                        <h1>${Math.abs(
                            pokemon1.base_stats - pokemon2.base_stats
                        )} pontos de status a mais!!</h1>
                    </div>`;
    }

    Swal.fire({
        title: titulo,
        html: mensagem,
    });
}

async function ComparaRecebe1() {
    let pokeNomeList = await carregaNomes();
    let idPoke = new URL(window.location.href).searchParams.get("idPoke");
    let pokePesquisado = await buscaInfo(parseInt(idPoke));
    await Swal.fire({
        title: `Selecione o Pokémon para comparar com ${pokePesquisado.nome}`,
        html: `
            <div style="display: flex; justify-content: space-around; align-items: center;">
                <img src="${pokePesquisado.img}"/>
                <img src="../img/vs.svg"/>
                <img src="../img/interrogacao.svg" style="width: 100px;"/>
            </div>`,
        input: "select",
        inputOptions: pokeNomeList,
        showCancelButton: true,
    }).then(async (nomeComparacao) => {
        if (nomeComparacao.isConfirmed) {
            let PokeComparacao = await buscaInfo(nomeComparacao.value);
            console.log(nomeComparacao);
            await compararPokemon(pokePesquisado, PokeComparacao);
        }
    });
}

async function comparaRecebe2() {
    let pokeNomeList = await carregaNomes();
    console.log()
    await Swal.fire({
        title: "Selecione o primeiro Pokémon",
        icon: "question",
        input: "select",
        inputPlaceholder: "Selecione o primeiro Pokémon",
        inputOptions: pokeNomeList,
        inputAttributes: {
            autocapitalize: "off",
        },
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Próximo",
        allowOutsideClick: false,
    })
        .then(async (primeiroResult) => {
            if (primeiroResult.isConfirmed) {
                let pokemon1 = await buscaInfo(
                    pokeNomeList[primeiroResult.value]
                );
                await Swal.fire({
                    title: "Selecione o segundo Pokémon",
                    html: `<div style="display: flex; justify-content: space-around; align-items: center;">
                                <img src="${pokemon1.img}" style = "width: 150px;"/>
                                <img src="../img/vs.svg" style="width: 100px;"/>
                                <img src="../img/interrogacao.svg" style="width: 100px;"/>
                            </div>`,
                    input: "select",
                    inputPlaceholder: "Selecione o segundo Pokémon",
                    inputOptions: pokeNomeList,
                    inputAttributes: {
                        autocapitalize: "off",
                    },
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Comparar",
                    allowOutsideClick: false,
                });
            }
        })
        .then(async (segundoResult) => {
            if (segundoResult.isConfirmed) {
                let SegundoPokemon = await buscaInfo(
                    pokeNomeList[segundoResult.value]
                );
                await compararPokemon(pokemon1, pokemon2);
            }
        });
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
