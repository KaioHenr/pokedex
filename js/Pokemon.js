export class Pokemon {
    #id;
    #nome;
    #status = {};
    #base_stats  = 0;
    #tipos = [];
    #img;
    #peso;
    #altura;
    #cadeia_evolutiva = [];//??
    #habilidades  = [];
    static totalPokemons = 0;

    constructor(id, nome, status, tipos, img, peso, altura, habilidades) {
        this.#id = id;
        this.#nome = nome;
        status.forEach(stats => {
            this.#base_stats += stats.base_stat;
            this.#status[stats.stat.name] = stats.base_stat;
        });
        tipos.forEach(tipo=>{
            this.#tipos.push(tipo.type.name);
        });
        this.#img = img;
        this.#peso = peso;
        this.#altura = altura;
        habilidades.forEach(habilidade=>{
            this.#habilidades.push(habilidade.ability.name);
        });
        Pokemon.totalPokemons += 1;
    }

    get id() {
        return this.#id;
    }
    get nome() {
        return this.#nome;
    }
    get status() {
        return this.#status;
    }
    get base_stats() {
        return this.#base_stats;
    }
    get tipos() {
        return this.#tipos;
    }
    get img() {
        return this.#img;
    }
    get peso() {
        return this.#peso;
    }
    get altura() {
        return this.#altura;
    }
    get cadeia_evolutiva() {
        return this.#cadeia_evolutiva;
    }
    get habilidades() {
        return this.#habilidades;
    }
    get totalPokemons(){
        return Pokemon.totalPokemons;
    }
    set cadeia_evolutiva(nova_cadeia) {
        return (this.#cadeia_evolutiva = nova_cadeia);
    }
}
