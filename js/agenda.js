class Agenda {
    constructor() {
        // URL para consultar las carreras de la temporada 2024
        this.apiUrl = "https://api.jolpi.ca/ergast/f1/2024.json";
        this.actionBoton();
    }

    
    obtenerCarrerasYMostrar() {
        
        $.ajax({
            url: this.apiUrl,
            method: "GET",
            dataType: "json",
            success: function(datos) {
                
                const carreras = datos.MRData.RaceTable.Races;
                const contenedor = $("main"); 

                contenedor.empty();

                // Recorrer todas las carreras y agregar su información al HTML
                carreras.forEach(function(carrera) {
                    const nombreCarrera = carrera.raceName;
                    const nombreCircuito = carrera.Circuit.circuitName;
                    const coordenadasCircuito = carrera.Circuit.Location;
                    const latitud = coordenadasCircuito.lat;
                    const longitud = coordenadasCircuito.long;
                    const fecha = carrera.date;
                    const hora = carrera.time || "No disponible";

                    // Formatear la fecha y hora de la carrera
                    const fechaFormateada = new Date(fecha);
                    const fechaHora = `${fechaFormateada.toLocaleDateString()} ${hora}`;

                    // Crear un artículo para cada carrera
                    const articulo = $("<article></article>");

                    // Agregar los detalles de la carrera al artículo
                    articulo.append("<h3>" + nombreCarrera + "</h3>");
                    articulo.append("<p><strong>Circuito:</strong> " + nombreCircuito + "</p>");
                    articulo.append("<p><strong>Ubicación:</strong> " + coordenadasCircuito.locality + ", " + coordenadasCircuito.country + "</p>");
                    articulo.append("<p><strong>Coordenadas:</strong> Latitud: " + latitud + ", Longitud: " + longitud + "</p>");
                    articulo.append("<p><strong>Fecha y Hora:</strong> " + fechaHora + "</p>");

                    // Agregar el artículo al contenedor de carreras
                    contenedor.append(articulo);
                });
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener los datos de las carreras: " + error);
            }
        });
    }

    actionBoton(){
        $(document).ready(function() {
            const agenda = new Agenda();
        
            // Al hacer clic en el primer botón del documento, cargar y mostrar las carreras
            $("button").on("click", function() {
                agenda.obtenerCarrerasYMostrar();  // Llamar al método único para cargar las carreras
            });
        });

    }
    

    
}
