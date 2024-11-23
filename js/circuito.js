class Circuito {
    constructor() {
        this.areaVisualizacion = $("section"); 
    }

    // Método para leer y procesar el archivo
    readInputFileXML(file) {
        const tipoTexto = /text.xml|application.xml|xml/;
        if (!file.type.match(tipoTexto)) {
            alert("Por favor, sube un archivo XML.");
            return;
        }

        const lector = new FileReader();
        lector.onload = (evento) => {
            const contenidoXML = evento.target.result;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contenidoXML, "application/xml");

            this.convertToHTML(xmlDoc);
        };
        lector.readAsText(file);
    }

    // Convierte el XML en HTML y lo muestra en el área de visualización
    convertToHTML(xmlDoc) {
        let htmlContent = "";

        // Recorre todos los elementos de nivel 1 en el XML (<evento>, <circuito>, etc.)
        $(xmlDoc).children().each((_, elemento) => {
            htmlContent += `<h2>${elemento.tagName}</h2>`;

            // Recorre todos los hijos de cada elemento de nivel 1
            $(elemento).children().each((_, subElemento) => {
                htmlContent += `<h3>${subElemento.tagName}</h3>`;

               

                // Itera sobre los atributos de cada subelemento, si los hay
                $.each(subElemento.attributes, (_, attr) => {
                    htmlContent += `<p><strong>${attr.name}:</strong> ${attr.value}</p>`;
                });

                // Si el subelemento tiene hijos, itera sobre ellos
                $(subElemento).children().each((_, nestedElemento) => {
                    htmlContent += `<h4>${nestedElemento.tagName}</h4>`;
                    htmlContent += `<p>${nestedElemento.textContent.trim()}</p>`;

                    // Itera sobre los atributos de cada elemento anidado, si los hay
                    $.each(nestedElemento.attributes, (_, attr) => {
                        htmlContent += `<p><strong>${attr.name}:</strong> ${attr.value}</p>`;
                    });
                });
            });
        });

        
        this.areaVisualizacion.append(htmlContent);
    }


    readInputFileKML(file) {
        const tipoTexto = /(\.kml$|application\/vnd\.google-earth\.kml\+xml)/i; 
        if (!file.name.match(tipoTexto) && !file.type.match(tipoTexto)) {
            alert("Por favor, sube un archivo KML.");
            return;
        }
    
        const lector = new FileReader();
        lector.onload = (evento) => {
            const contenidoKML = evento.target.result;
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(contenidoKML, "application/xml");
    
            // Genera el mapa dinámico con el KML procesado
            this.convertToMapaDinamico(kmlDoc);
        };
        lector.readAsText(file);
    }
    


    convertToMapaDinamico(kmlDoc) {
        // Convierte el KML a GeoJSON
        const geojson = toGeoJSON.kml(kmlDoc);

        if (!geojson || !geojson.features || geojson.features.length === 0) {
            alert("El archivo KML no contiene datos válidos.");
            return;
        }
        //Pone las primeras 
        const firstFeature = geojson.features.find(
            (feature) => feature.geometry && feature.geometry.coordinates
        );
        const center = firstFeature ? firstFeature.geometry.coordinates.slice(0, 2) : [0, 0];


        const mapaContenedor = document.querySelector("div");

        // Configura el mapa de Mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yOTQ0MjAiLCJhIjoiY20zZzB0czUxMDF3ODJqczhreXo3am03bCJ9.qnbTHMbnc2SLib38zCnlPw';
        const mapaDinamico = new mapboxgl.Map({
            container: mapaContenedor,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: center,
            zoom: 12
        });

        // Espera a que el mapa se cargue para agregar las capas
        mapaDinamico.on('load', () => {
            
            // Agrega la fuente GeoJSON
            mapaDinamico.addSource('ruta', {
                'type': 'geojson',
                'data': geojson
            });

            // Agrega puntos al mapa
            mapaDinamico.addLayer({
                'id': 'puntos',
                'type': 'circle',
                'source': 'ruta',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#ff0000'
                }
            });

            // Agrega una línea para las rutas
            mapaDinamico.addLayer({
                'id': 'linea-ruta',
                'type': 'line',
                'source': 'ruta',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#0000ff',
                    'line-width': 2
                }
            });
        });
    }


    readInputFileSVG(file) {
        const tipoSVG = /image\/svg\+xml/;
        if (!file.type.match(tipoSVG)) {
            alert("Por favor, sube un archivo SVG.");
            return;
        }
    
        const lector = new FileReader();
        lector.onload = (evento) => {
            const contenidoSVG = evento.target.result;
            
            const article = document.querySelector('figure');
            article.innerHTML = contenidoSVG;
        };
        lector.readAsText(file);
    }
    
}
