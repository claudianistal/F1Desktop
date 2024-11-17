class Pais {
    //Atributos
    nombre;
    nombreCapital;
    poblacion;
    nombreCircuito;
    formaGobierno;
    coordLineaMeta;
    religion;

    constructor (nombre, nombreCapital, poblacion){
        this.nombre = nombre;
        this.nombreCapital = nombreCapital;
        this.poblacion = poblacion;
    }

    setInfoAdicional(nombreCircuito, formaGobierno, coordLineaMeta, religion){
        this.nombreCircuito = nombreCircuito;
        this.formaGobierno = formaGobierno;
        this.coordLineaMeta = coordLineaMeta;
        this.religion = religion;
    }


    getNombre(){
        return this.nombre;
    }

    getCapital(){
        return this.nombreCapital;
    }

    getListaInfoSec(){
        return "<ul>" +
                    "<li>" + this.nombreCircuito + "</li>" +
                    "<li>" + "Población: "+ this.poblacion  + "</li>" +
                    "<li>" + "Forma de Gobierno: "+this.formaGobierno + "</li>" + 
                    "<li>" + "Religión: "+this.religion + "</li>" +
                "</ul>";
    }

    writeCoordenadas(){
        document.write("<h4> Coordenadas Línea de Meta del Circuito: " + this.coordLineaMeta + "</h4>");
    }


    cargarPrevisionTiempo() {
        var apiKey = "58f7f5427bf6e0a3e5ed2a13c4171ece";  
        var ciudad = this.nombreCapital;  
        var tipo = "&mode=xml";  
        var unidades = "&units=metric";  
        var idioma = "&lang=es";  
        var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + ciudad + tipo + unidades + idioma + "&APPID=" + apiKey;
    
        $.ajax({
            dataType: "xml",  
            url: url,
            method: 'GET',
            success: function(datos) {
                var pronosticos = $(datos).find("time");  
                var seccion = $("main > section:last-of-type");
    
                for (var i = 0; i < 40; i+=8) {
                    var pronostico = $(pronosticos[i]);  
                    var fecha = pronostico.attr("from");
                    var fechaFormateada = new Date(fecha); 
    
                    var maxTemp = pronostico.find("temperature").attr("max");  
                    var minTemp = pronostico.find("temperature").attr("min");  
                    var humedad = pronostico.find("humidity").attr("value");  
                    var lluvia = pronostico.find("value").attr("value") || 0;  
                    var descripcion = pronostico.find("symbol").attr("name");  
                    var codigoNum = pronostico.find("symbol").attr("var"); 
    
                    var articulo = $("<article></article>");
                    articulo.append("<h4>" + fechaFormateada.toLocaleDateString() + "</h4>");  
                    articulo.append("<img src='https://openweathermap.org/img/wn/" + codigoNum + "@2x.png' alt='" + descripcion + "'>");
                    articulo.append("<p>Descripción: " + descripcion + "</p>");
                    articulo.append("<p>Temperatura máxima: " + maxTemp + "°C</p>");
                    articulo.append("<p>Temperatura mínima: " + minTemp + "°C</p>");
                    articulo.append("<p>Humedad: " + humedad + "%</p>");
                    articulo.append("<p>Lluvia: " + lluvia + " mm</p>");
    
                    seccion.append(articulo);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener los datos del tiempo: " + error);
            }
        });
    }
    
    
    

}