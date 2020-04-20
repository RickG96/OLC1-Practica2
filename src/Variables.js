export default class Variable {
    constructor(tipo, nombre, valor) {
        this._tipo = tipo
        this._nombre = nombre
        this._valor = valor
    }

    get tipo() {
        return this.tipo
    }

    get nombre() {
        return this.nombre
    } 

    get valor() {

    }

    set tipo(tipo) {
        this._tipo = tipo
    }

    set nombre(nombre) {
        this._nombre = nombre
    }

    set valor(valor) {
        this._valor = valor
    }
}