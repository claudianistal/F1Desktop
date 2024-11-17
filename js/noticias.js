class Noticias {
    constructor(){
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.tieneAPIFile = true;
        }else{
            this.tieneAPIFile = false;
        }
    }

    readInputFile(file) {
        if (!this.tieneAPIFile) return;

        const tipoTexto = /text.*/;

        if (file.type.match(tipoTexto)) {
            const lector = new FileReader();

            lector.onload = (evento) => {
                // Obtener el contenido del archivo y separar cada línea
                const contenido = evento.target.result;
                const lineas = contenido.split("\n");

                // Almacenar las noticias procesadas
                this.noticias = lineas.map(linea => {
                    const [titulo, entradilla, autor] = linea.split("_");
                    return { titulo, entradilla, autor };
                });

                
                this.creaHTML();
            };

            lector.readAsText(file);
        } 
    }

    creaHTML() {
        const areaVisualizacion = $("section:last-of-type");

        const imagenURL = "multimedia/imagenes/Marca.png";
        

        this.noticias.forEach(noticia => {
            const noticiaHTML = `
                <article>
                    <img src="${imagenURL}" alt="Imagen de la noticia">
                    <h4>${noticia.titulo}</h4>
                    <p>${noticia.entradilla}</p>
                    <p><strong>Autor:</strong> ${noticia.autor}</p>
                </article>
            `;
            areaVisualizacion.append(noticiaHTML);
        });
    }

    crearNoticia(){
        var areaVisualizacion = $("section:last-of-type");

        // Obtener los datos del formulario
        var texAreas = document.getElementsByTagName("textarea");
        const titulo = texAreas[0].value;
        const entradilla = texAreas[1].value;
        const autor = texAreas[2].value;
        const imagenURL = "multimedia/imagenes/Marca.png";

        if (!titulo || !entradilla || !autor) {
            alert("Por favor, completa todos los campos antes de añadir la noticia.");
            return;
        }

        // Crear la noticia
        const noticiaHTML = `
            <article>
                <img src="${imagenURL}" alt="Imagen de la noticia">
                <h4>${titulo}</h4>
                <p>${entradilla}</p>
                <p><strong>Autor:</strong> ${autor}</p>
            </article>
        `;

        areaVisualizacion.append(noticiaHTML);

        texAreas[0].value = "";
        texAreas[1].value = "";
        texAreas[2].value = "";


    }
}

const noticiasApi = new Noticias();