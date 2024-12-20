class Viajes{
    constructor(){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion){
        this.longitud = posicion.coords.longitude; 
        this.latitud = posicion.coords.latitude;  
    }

    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    getMapaEstatico() {
        // Configuración del mapa estático de Mapbox
        const mapboxToken = 'pk.eyJ1IjoidW8yOTQ0MjAiLCJhIjoiY20zZzB0czUxMDF3ODJqczhreXo3am03bCJ9.qnbTHMbnc2SLib38zCnlPw';
        const zoomLevel = 14; 
        
        const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${this.longitud},${this.latitud},${zoomLevel}/600x400?access_token=${mapboxToken}`;
        const mapUrlTablet = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${this.longitud},${this.latitud},${zoomLevel}/420x240?access_token=${mapboxToken}`;
        const mapUrlMovil = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${this.longitud},${this.latitud},${zoomLevel}/220x110?access_token=${mapboxToken}`;
        
        const mapaArticle = document.querySelector("article");
        const titulo = document.querySelector("h3");
        mapaArticle.innerHTML = `<picture>
                                    <source media="(max-width:465px)" srcset="${mapUrlMovil}">
                                    <source media="(max-width:799px)" srcset="${mapUrlTablet}">
                                    <img src="${mapUrl}" alt="Mapa de la posición del usuario"></img>  
                                </picture>`;
        mapaArticle.prepend(titulo);
        

        const input = document.querySelector("input:first-of-type");
        input.disabled = true;
    }

    getMapaDinamico() {
        // Seleccionar el último div del body para usarlo como contenedor
        const mapaContenedor = document.querySelector("div:first-of-type");
        
        // Inicializar el mapa de Mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yOTQ0MjAiLCJhIjoiY20zZzB0czUxMDF3ODJqczhreXo3am03bCJ9.qnbTHMbnc2SLib38zCnlPw';
        const mapaDinamico = new mapboxgl.Map({
            container: mapaContenedor,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [this.longitud, this.latitud],
            zoom: 14
        });

        // Añadir un marcador en la posición del usuario
            new mapboxgl.Marker()
                .setLngLat([this.longitud, this.latitud])
                .addTo(mapaDinamico);

        const input = document.querySelector("input:last-of-type");
        input.disabled = true;
    }  
    
    // Método para mover los slides
    moveSlides() {
        this.slides.forEach((slide, indx) => {
          const trans = 100 * (indx - this.curSlide);
          slide.style.transform = `translateX(${trans}%)`; // Cambiar transform usando JavaScript nativo
        });
      }
    
      // Método para ir al siguiente slide
    nextSlide() {
        if (this.curSlide === this.maxSlide) {
          this.curSlide = 0;
        } else {
          this.curSlide++;
        }
        this.moveSlides();
    }
    
      // Método para ir al slide anterior
    prevSlide() {
        if (this.curSlide === 0) {
          this.curSlide = this.maxSlide;
        } else {
          this.curSlide--;
        }
        this.moveSlides();
    }

    // Método para inicializar los eventos
    initCarrusel() {
        this.slides = document.querySelectorAll('img');
        this.nextButton = document.querySelector('button:first-of-type'); 
        this.prevButton = document.querySelector('button:nth-of-type(2)'); 
        this.curSlide = 0; 
        this.maxSlide = this.slides.length - 1; 
        this.nextButton.addEventListener("click", () => this.nextSlide());

        this.prevButton.addEventListener("click", () => this.prevSlide());
    }

}

const viaje = new Viajes();