import * as globales from "./globales"
import Token from "./Token"
import Variable from "./Variables"

export function analizador(entrada) {
    let asciiChar
    let limpio = []
    let fila = 1
    let columna = 0

    for(let i = 0; i < entrada.length; i++) {
        asciiChar = entrada.charCodeAt(i)

        if((asciiChar > 31 && asciiChar < 126) || asciiChar == 10 || asciiChar == 13){
            limpio.push(entrada.charAt(i))
            if(asciiChar == 10) {
                fila++
                columna = 0
            }
        } else {
            if(/\s/gm.test(entrada.charAt(i)) == false) {
                console.log("Error Lexico : " + entrada.charAt(i) + " en la fila: " + fila + " en la columna: " + columna)
                listaErrores.push("Error Lexico : " + entrada.charAt(i) + " en la fila: " + fila + " en la columna: " + columna)
            }
        }
        columna++   
    }
    buscarTokens(limpio.join(""))
    traducirPython()
    return limpio.join("")

}

let listaErrores = []
let listaTokens = []

function buscarTokens(entradaLimpia) {
    let asciiChar
    let token = ""
    let comentarioM = false
    let comentarioU = false
    let esString = false
    let esPrint = false
    let especial = false
    let contComillaD = 0
    let contComillaS = 0
    
    for(let i = 0; i < entradaLimpia.length; i++) {
        asciiChar = entradaLimpia.charCodeAt(i)

        if(asciiChar == 34) { // string
            esString = true
            especial = true
        } else if(asciiChar == 47) {  // puede ser comentario de una linea o multilinea
            if(entradaLimpia.charAt(i+1) == '/' && comentarioM == false) {
                comentarioU = true
                especial = true
            } else if(entradaLimpia.charAt(i+1) == '*') {
                comentarioM = true
                especial = true
            }
        } else if(asciiChar == 39) { // print
            esPrint = true
            especial = true
        }
        
        if(especial == false) {
            if((asciiChar > 47 && asciiChar < 58) || (asciiChar > 64 && asciiChar < 91) || (asciiChar > 96 && asciiChar < 123) || asciiChar == 95) {
                token += entradaLimpia.charAt(i)
            } else {
                if(asciiChar == 32 || asciiChar == 10) {
                    if(token != "") {
                        buscarEnGlobales(token)
                        token = ""
                    }
                } else {
                    if(token != "") {
                        buscarEnGlobales(token)
                        token = ""
                    }
                    
                    if((asciiChar == 38 && entradaLimpia.charAt(i+1) == "&") || (asciiChar == 124 && entradaLimpia.charAt(i+1) == "|") || (asciiChar == 33 && entradaLimpia.charAt(i+1) == "=")) {
                        buscarEnGlobales(entradaLimpia.charAt(i) + entradaLimpia.charAt(i+1))
                        i++
                    } else {
                        buscarEnGlobales(entradaLimpia.charAt(i))
                    }
                    
                }
            }
        } else {
            token += entradaLimpia.charAt(i)

            if(asciiChar == 39) contComillaS++
            if(asciiChar == 34) contComillaD++

            if(contComillaD == 2) {
                buscarEnGlobales(token)
                token = ""
                especial = false
                contComillaD = 0
            } 
            if(contComillaS == 2) {
                buscarEnGlobales(token)
                token = ""
                especial = false
                contComillaS = 0
            }
            if(comentarioM) {
                if(asciiChar == 47 && entradaLimpia.charAt(i-1) == "*") {
                    buscarEnGlobales(token)
                    token = ""
                    especial = false
                    comentarioM = false
                } 
            }
            if(comentarioU) {
                if(asciiChar == 10) {
                    buscarEnGlobales(token)
                    token = ""
                    especial = false
                    comentarioU = false
                }
            } 
        }
    }
    //console.log(listaTokens)
    if(nivel < 0) listaErrores.push("Error sintactico: hace falta llave de apertura")
    if(nivel > 0) listaErrores.push("Error sintactico: hace falta llave de cerrada")
    tablaDeErrores()
}

function tablaDeErrores() {
    let table = document.getElementById("tablaError")
    for(let i = 0; i < listaErrores.length; i++) {
        let row = table.insertRow(table.length)
        let num = row.insertCell(0)
        let desc = row.insertCell(1)
        num.innerHTML = "" + i
        desc.innerHTML = listaErrores[i]
    }
}

let contador = 0
let nivel = 0
let fila = 0
let banderaFor = false
let contadorPC = 0

function buscarEnGlobales(token) {
   
    for(let i = 0; i < globales.reservadas.length; i++) {
        if(token === globales.reservadas[i].valor) {
            nuevoToken(token, globales.reservadas[i].nombre) // esto estaba abajo de los if
            
            if(token == "for") banderaFor = true
            if(globales.reservadas[i].valor == "{") {
                nivel++
                fila++
            }
            if(globales.reservadas[i].valor == ";" && banderaFor == false) {
                fila++
            }
            if(globales.reservadas[i].valor == "}") {
                nivel--
                fila++
            }
            if(globales.reservadas[i].valor == ";" && banderaFor == true) {
                contadorPC++
                if(contadorPC == 2) {
                    contadorPC = 0
                    banderaFor = false
                }
            } 
            return true
        }
    }

    if(globales.regexId.test(token)) {
        nuevoToken(token, "id")
        return true
    }

    if(globales.regexUna.test(token)) {
        nuevoToken(token, "comentario")
        return true
    }


    if(globales.regexMulti.test(token)) {
        nuevoToken(token, "comentarios")
        return true
    }

    if(globales.regexPrint.test(token)) {
        nuevoToken(token, "print") //hay que hacer acciones
        return true
    }

    if(globales.regexString.test(token)) {
        nuevoToken(token, "cadena")
        return true
    }

    if(globales.regexNumber.test(token)) {
        nuevoToken(token, "numero")
        return true
    }

    return false
}

function nuevoToken(valor, tipo) {
    contador++
    let token = new Token(valor, tipo, contador, nivel, fila)
    listaTokens.push(token)
}


function traducirPython() {
    let traducido = ""
    let auxiliar
    let lineaActual = listaTokens[0]._linea
    let nivelActual = listaTokens[0]._nivel
    let esVarFun = false
    let esMetodo = false
    let esIf = false
    let esFor = false
    let esWhile = false
    let esPrint = false
    let esAsignacion = false
    let htmlRecolectado = ""
    let hayHtml = false
    let listaVariables = []
    for(let i = 0; i < listaTokens.length; i++) {
        //verificamos en que linea y nivel estamos
        if(listaTokens[i]._linea != lineaActual) {
            lineaActual = listaTokens[i]._linea
            traducido += "\n"
            for(let j = 0; j < listaTokens[i]._nivel; j++) {
                traducido += "\t"
            }
        }

        if(listaTokens[i]._tipo == "tipo_dato") {
            if(listaTokens[i+2]._tipo == "s_apar"){
                esVarFun = true
                esMetodo = true
                for(let j = i+1; j < listaTokens.length; j++) {
                    if(listaTokens[j]._tipo == "tipo_dato") {
                        listaTokens[j].tipo = "vacio" 
                    }
                    if(listaTokens[j]._tipo == "s_cpar") {
                        break;
                    }
                }
            } 
           
            if(esVarFun) {
                traducido += "def "
                esVarFun = false
            } else {
                let tipo = listaTokens[i]._valor
                let valor = ""
                let listaAux = []
                let bigual = false
                
                for(let j = i+1; j < listaTokens.length; j++) {
                    if(listaTokens[j]._tipo == "id") listaAux.push(listaTokens[j]._valor)
                    if(bigual && listaTokens[j]._tipo != "s_pc") valor += listaTokens[j]._valor
                    if(listaTokens[j]._tipo == "s_igual") bigual = true
                    if(listaTokens[j]._tipo == "s_pc") break
                }
                for(let j = 0; j < listaAux.length; j++) {
                    let nuevo = new Variable(tipo, listaAux[j], valor)
                    listaVariables.push(nuevo)
                }
                esAsignacion = true
                traducido += "var "    
            }

        } else if(listaTokens[i]._tipo == "comentario") {
            //auxiliar = listaTokens[i]._valor.replace("//", "#")
            //traducido += auxiliar
        } else if(listaTokens[i]._tipo == "comentarios") {
            auxiliar = listaTokens[i]._valor.replace("/*", "'''")
            auxiliar = auxiliar.replace("*/", "'''")
            traducido += auxiliar
        } else if(listaTokens[i]._tipo == "metodo") {
            for(let j = i+1; j < listaTokens.length; j++) {
                if(listaTokens[j]._tipo == "tipo_dato") {
                    listaTokens[j].tipo = "vacio" 
                }
                if(listaTokens[j]._tipo == "s_cpar") {
                    break;
                }
            }
            if(listaTokens[i+1]._tipo != "r_main") esMetodo = true
            traducido += "def "
        } else if(listaTokens[i]._tipo == "r_main") {
            i = i + 2
            traducido += "main():"
        } else if(listaTokens[i]._tipo == "r_if") {
            esIf = true
            traducido += "if "
        } else if(listaTokens[i]._tipo == "r_else") {
            if(listaTokens[i+1]._tipo == "r_if") {
                traducido += "else "
            } else {
                traducido += "else: "
            }
        } else if(listaTokens[i]._tipo == "r_switch") {
            traducido += "def switch"
        } else if(listaTokens[i]._tipo == "r_for") {
            esFor = true
            traducido += "for "
        } else if(listaTokens[i]._tipo == "r_while") {
            esWhile = true
            traducido += "while "
        } else if(listaTokens[i]._tipo == "r_write") {
            esPrint = true
            traducido += "print"
        } else if(listaTokens[i]._tipo == "r_return") {
            traducido += "return "
        } else if(listaTokens[i]._tipo == "r_break") {
            traducido += "break "
        } else if(listaTokens[i]._tipo == "r_continue") {
            traducido += "continue "
        } else if(listaTokens[i]._tipo == "s_rel") {
            traducido += listaTokens[i]._valor + " "
        } else if(listaTokens[i]._tipo == "s_ari") {
            traducido += listaTokens[i]._valor
        } else if(listaTokens[i]._tipo == "s_and") {
            traducido += "and "
        } else if(listaTokens[i]._tipo == "s_or") {
            traducido += "or "
        } else if(listaTokens[i]._tipo == "s_not") {
            traducido += "not "
        } else if(listaTokens[i]._tipo == "id") {
            traducido += listaTokens[i]._valor + " "

            let existe = false
            let lugar 
            for(let j = 0; j < listaVariables.length; j++) {
                if(listaVariables[j]._nombre == listaTokens[i]._valor) {
                    existe = true
                    lugar = j
                    break
                }
            }
            if(existe && !esIf && !esWhile) {
                let bandera = false
                let valorNuevo = ""
                for(let j = i; j < listaTokens.length; j++) {
                    if(listaTokens[j]._tipo == "s_pc") break
                    if(bandera) valorNuevo += listaTokens[j]._valor
                    if(listaTokens[j]._tipo == "s_igual") bandera = true 
                }
                if(bandera) listaVariables[lugar]._valor = valorNuevo
            }
        } else if(listaTokens[i]._tipo == "s_apar") {
            if(esMetodo || esPrint || esAsignacion) {
                traducido += "("
            }
            if(esFor) {
                
                let nombreVar = listaTokens[i+2]._valor
                let rangoA = listaTokens[i+4]._valor 
                let rangoB = listaTokens[i+8]._valor
                for(let j = i+1; j < listaTokens.length; j++) {
                    if(listaTokens[j]._tipo == "s_cpar") {
                        i = j - 1
                        break
                    }
                }
                traducido += nombreVar + " in a range(" + rangoA + ", " + rangoB + ""
            }
        } else if(listaTokens[i]._tipo == "s_cpar") {
            if(esMetodo) {
                traducido += "):"
                esMetodo = false
            }
            if(esIf || esWhile) {
                traducido += ":"
                esIf = false
                esWhile = false
            }
            if(esFor) {
                traducido += "):"
                esFor = false
            }
            if(esPrint) {
                traducido += ")"
                esPrint = false
            }
            if(esAsignacion) {
                traducido += ")"
            }
        } else if(listaTokens[i]._tipo == "numero") {
            traducido += listaTokens[i]._valor
        } else if(listaTokens[i]._tipo == "s_igual") {
            traducido += "= "
        } else if(listaTokens[i]._tipo == "cadena") {
            traducido += listaTokens[i]._valor
        } else if(listaTokens[i]._tipo == "print") {
            
            if(/[<].+[>].*[<][\/].+[>]/gm.test(listaTokens[i]._valor)) {
                hayHtml = true
                htmlRecolectado += listaTokens[i]._valor
                traducido += listaTokens[i]._valor
            } else {
                traducido += listaTokens[i]._valor
            }
            
        } else if(listaTokens[i]._tipo == "s_pc") {
            if(esAsignacion) esAsignacion = false
        } else if(listaTokens[i]._tipo == "r_true") {
            traducido += listaTokens[i]._valor
        }  else if(listaTokens[i]._tipo == "r_false") {
            traducido += listaTokens[i]._valor
        } else if(listaTokens[i]._tipo == "s_c") {
            traducido += listaTokens[i]._valor
        } else if(listaTokens[i]._tipo == "s_p") {
            if(listaTokens[i-1]._tipo != "r_consol") traducido += listaTokens[i]._valor
        }
    }

    
    if(hayHtml) {
        document.getElementById("taHTML").value = format(htmlRecolectado.replace(/\'/g,""))
        let json = mapDOM(htmlRecolectado.replace(/\'/g,""), true)
        document.getElementById("taJSON").value = JSON.stringify(JSON.parse(json), null, 4)
    }
    document.getElementById("taPY").value = traducido

    tablaDeSimbolos(listaVariables)
}

function tablaDeSimbolos(lista) {
    let table = document.getElementById("tabla")
    for(let i = 0; i < lista.length; i++) {
        let row = table.insertRow(table.length)
        let num = row.insertCell(0)
        let tipo = row.insertCell(1)
        let nombre = row.insertCell(2) 
        let valor = row.insertCell(3)
        num.innerHTML = "" + i
        tipo.innerHTML = lista[i]._tipo
        nombre.innerHTML = lista[i]._nombre
        valor.innerHTML = "<xmp>" + lista[i]._valor + "</xmp>"
    }
}

function format(html) {
    let tab = '\t';
    let result = '';
    let indent= '';

    html.split(/>\s*</).forEach(function(element) {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match( /^<?\w[^>]*[^\/]$/ )) { 
            indent += tab;              
        }
    });

    return result.substring(1, result.length-3);
}

function mapDOM(element, json) {
    var treeObject = {};
    let parser 
    let docNode
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
        } else { // Microsoft strikes again
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element); 
        } 
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object[element.nodeName] = [];
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object[element.nodeName] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object[element.nodeName].push(nodeList[i].nodeValue);
                    } else {
                        object[element.nodeName].push({});
                        treeHTML(nodeList[i], object[element.nodeName][object[element.nodeName].length -1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["atributos"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["atributos"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);

    return (json) ? JSON.stringify(treeObject) : treeObject;
}