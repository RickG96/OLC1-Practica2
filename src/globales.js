export let reservadas = [
    {
        nombre: "tipo_dato",
        valor: "int",
    },
    {
        nombre: "tipo_dato",
        valor: "double",
    },
    {
        nombre: "tipo_dato",
        valor: "char",
    },
    {
        nombre: "tipo_dato",
        valor: "bool",
    },
    {
        nombre: "tipo_dato",
        valor: "string",
    },
    {
        nombre: "metodo",
        valor: "void"
    },
    {
        nombre: "r_main",
        valor: "main"
    },
    {
        nombre: "r_if",
        valor: "if"
    },
    {
        nombre: "r_else",
        valor: "else"
    },
    {
        nombre: "r_switch",
        valor: "switch"
    },
    {
        nombre: "r_case",
        valor: "case"
    },
    {
        nombre: "r_default",
        valor: "default"
    },
    {
        nombre: "r_for",
        valor: "for",
    },
    {
        nombre: "r_while",
        valor: "while"
    },
    {
        nombre: "r_do",
        valor: "do",
    },
    {
        nombre: "r_consol",
        valor: "Console"
    },
    {
        nombre: "r_write",
        valor: "Write"
    }, 
    {
        nombre: "r_return",
        valor: "return"
    },
    {
        nombre: "r_break",
        valor: "break"
    },
    {
        nombre: "r_continue",
        valor: "continue"
    },
    {
        nombre: "r_true",
        valor: "true"
    },
    {
        nombre: "r_false",
        valor: "false"
    },
    {//para operaciones arimeticas
        nombre: "s_ari",
        valor: "+",
    },
    {
        nombre: "s_ari",
        valor: "-",
    },
    {
        nombre: "s_ari",
        valor: "*"
    },
    {
        nombre: "s_ari",
        valor: "/",
    },
    {//para operaciones logicas
        nombre: "s_and",
        valor: "&&"
    },
    {
        nombre: "s_or",
        valor: "||",
    },
    {
        nombre: "s_not",
        valor: "!"
    },
    {//para operaciones relacionales
        nombre: "s_rel",
        valor: ">"
    },
    {
        nombre: "s_rel",
        valor: "<",
    },
    {
        nombre: "s_rel",
        valor: ">=",
    },
    {
        nombre: "s_rel",
        valor: "<=",
    },
    {
        nombre: "s_rel",
        valor: "==",
    },
    {
        nombre: "s_rel",
        valor: "!=",
    },
    {//caracteres del legunaje
        nombre: "s_apar",
        valor: "("
    },
    {
        nombre: "s_cpar",
        valor: ")"
    },
    {
        nombre: "s_allav",
        valor: "{"
    },
    {
        nombre: "s_cllav",
        valor: "}"
    },
    {
        nombre: "s_pc",
        valor: ";"
    },
    {
        nombre: "s_dp",
        valor: ":"
    },
    {
        nombre: "s_c",
        valor: ","
    },
    {
        nombre: "s_p",
        valor: "."
    }, 
    {
        nombre: "s_igual",
        valor: "="
    }
]



export const regexId = /^[a-z-A-Z][a-z_A-Z0-9]*$/

export const regexUna = /\/\/.*/gm

export const regexMulti = /\/\*([\s\S]*?)\*\//

export const regexPrint = /^['][^]*[']$/

export const regexString = /^["][^]*["]$/

export const regexNumber = /^-?\d*\.?\d+$/