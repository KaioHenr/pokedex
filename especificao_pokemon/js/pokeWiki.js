document.addEventListener("DOMContentLoaded", function () {
    const buscarButton = document.getElementById("buscarButton");
    buscarButton.addEventListener("click", buscaPoke);
});

async function buscaPoke() {
    let input = document.getElementById("pokeBusca");
    if (input.value != "") {
        await buscaInfo(input.value);
    } else {
        window.alert("tu n colocou pokemon nenhum no input seu safado");
    }
}
