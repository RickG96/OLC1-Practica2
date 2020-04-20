export default class Token {
    constructor(valor, tipo, numero, nivel, linea) {
        this._valor = valor
        this._tipo = tipo
        this._numero = numero
        this._nivel = nivel
        this._linea = linea
    }

    get valor() {
        return this.valor
    }

    get tipo() {
        return this.tipo
    }

    get numero() {
        return this.numero
    }

    get nivel() {
        return this.nivel
    }

    get linea() {
        return this.linea
    }

    set valor(valor) {
        this._valor = valor
    }

    set tipo(tipo) {
        this._tipo = tipo
    }

    set numero(numero) {
        this._numero = numero 
    }

    set nivel(nivel) {
        this._nivel = nivel
    }

    set linea(linea) {
        this._linea = linea
    }
}