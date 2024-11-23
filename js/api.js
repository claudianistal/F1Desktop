class F1Locator {
    constructor() {
        this.circuits = [
            { name: "Silverstone", lat: 52.0786, lon: -1.0169, image: "multimedia/imagenes/api/Silverstone.png" },
            { name: "Monza", lat: 45.6197, lon: 9.2811, image: "multimedia/imagenes/api/Monza.png" },
            { name: "Suzuka", lat: 34.8431, lon: 136.541, image: "multimedia/imagenes/api/Suzuka.png" },
            { name: "Spa-Francorchamps", lat: 50.4372, lon: 5.9714, image: "multimedia/imagenes/api/Spa-Francorchamps.png" },
            { name: "Interlagos", lat: -23.7036, lon: -46.6997, image: "multimedia/imagenes/api/Interlagos.png" },
            { name: "Circuit de Barcelona-Catalunya", lat: 41.5735, lon: 2.2612, image: "multimedia/imagenes/api/Catalunya.png" }
          ];

        this.canvas = document.querySelector("main > canvas");
        this.context = this.canvas.getContext('2d');
        this.drawing = false;
    
        // Vincular los eventos del ratón para el dibujo
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Para el reproductor de música
        this.audioPlayer = document.querySelector("audio");
        this.audioSource = document.createElement("source");
        this.audioPlayer.appendChild(this.audioSource);
    }


    //--------------------------------------- API Geolocation ----------------------------------------------
  
    // Función para calcular la distancia entre dos puntos (Fórmula de Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
      const R = 6371; // Radio de la Tierra en km
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distancia en km
    }
  
    // Método para obtener la ubicación del usuario
    getUserLocation(callback) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            callback(userLat, userLon);
          },
          () => {
            this.displayResult("No se pudo obtener tu ubicación.");
          }
        );
      } else {
        this.displayResult("La geolocalización no está disponible en tu navegador.");
      }
    }
  
    // Método para encontrar el circuito más cercano
    findNearestCircuit() {
      this.getUserLocation((userLat, userLon) => {
        let nearestCircuit = null;
        let minDistance = Infinity;
  
        this.circuits.forEach((circuit) => {
          const distance = this.calculateDistance(userLat, userLon, circuit.lat, circuit.lon);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCircuit = circuit;
          }
        });
  
        this.displayResult(`El circuito más cercano es ${nearestCircuit.name}, a ${minDistance.toFixed(2)} km de distancia.`);

        this.displayCircuitImage(nearestCircuit.image);
      });
    }
  
    // Método para mostrar el resultado
    displayResult(message) {
        var resultElement = document.querySelector("main > p:first-of-type");
        resultElement.textContent = message;
    }

     // Método para mostrar la imagen del circuito
    displayCircuitImage(imageUrl) {
        var imageElement = document.querySelector("img");
        imageElement.src = imageUrl; // Establece la imagen
        imageElement.style.display = "block"; // Asegura que la imagen sea visible
    }

    //--------------------------------------- API CANVAS --------------------------------------------

    // Iniciar el dibujo
    startDrawing(event) {
        this.drawing = true;
        this.context.beginPath();
        const rect = this.canvas.getBoundingClientRect();
        this.context.moveTo(event.clientX - rect.left, event.clientY - rect.top); 
    }

    // Dibujar en el canvas
    draw(event) {
        if (!this.drawing) return;
        const rect = this.canvas.getBoundingClientRect();
        this.context.lineTo(event.clientX - rect.left, event.clientY - rect.top); 
        this.context.stroke();
    }

    // Detener el dibujo
    stopDrawing() {
        this.drawing = false;
        this.context.closePath();
    }

    // Limpiar el lienzo
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //--------------------------------------- API Web Audio ----------------------------------------------

    loadAudio(event) {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg' && file.name.endsWith('.mp3')) {
            const objectURL = URL.createObjectURL(file);
            this.audioSource.src = objectURL;
            this.audioPlayer.load();
        } else {
            alert("Por favor, selecciona un archivo MP3 válido.");
        }
    }

    playAudio() {
        if (this.audioPlayer) {
            this.audioPlayer.play();
        } else {
            alert("No se ha cargado ninguna canción.");
        }
    }

    pauseAudio() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }
    }

    stopAudio() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
    }



  }
  
 
  
