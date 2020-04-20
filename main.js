let anal = require('./src/analizador')

cargarArchivo = function() {
    let archivos = document.getElementById("customFile").files

    let archivo = archivos[0]

    let reader = new FileReader()

    reader.onload = function(e) {
        let arc = e.target.result
        document.getElementById("taCS").value = anal.analizador(arc)
        
    }
    reader.readAsText(archivo)

} 
