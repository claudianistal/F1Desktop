
class Semaforo{

    constructor(){
        this.levels = [0.2, 0.5, 0.8];  //Representa la dificultad del juego
        this.lights = 4; //Representa el número de luces del semaforo
        this.unload_moment = null; //Fecha que representa el momento en el que se inicia la secuencia
        this.clic_moment = null; //Fecha que determina el momento en el que el usuario hace clic para parar

        const randomIndex = Math.floor(Math.random() * this.levels.length);
        this.difficulty = this.levels[randomIndex];

        this.createStructure();
    }


    createStructure(){
        const main = document.querySelector('main');

        const title = document.createElement('h2');
        title.textContent = "Juego del Semáforo";
        main.appendChild(title);
        for(let i = 0; i<= this.levels.length ; i++) {
           const htmlDiv = document.createElement('div');
           main.appendChild(htmlDiv);
        }
        const botonArranque = document.createElement('button');
        botonArranque.textContent = "Arranque";
        const botonReaccion = document.createElement('button');
        botonReaccion.textContent = "Reacción";
        botonReaccion.disabled = true;
        main.appendChild(botonArranque);
        main.appendChild(botonReaccion);

        this.initSequence();
        
    }


    initSequence() {
        const botonArranque = document.querySelector('main button:first-of-type');
        var self = this;
        
        botonArranque.addEventListener("click", function () {
            var main = document.getElementsByTagName('main')[0];
           
            // Eliminar el <p> de tiempo de reacción si existe
            const p = document.querySelector('main > p');
            if (p != null) {
                main.removeChild(p);
            }
            
            main.classList.add('load');

            botonArranque.disabled = true;
            setTimeout(() => {
                self.unload_moment = new Date();
                self.endSequence();
            }, 2000 + self.difficulty * 100); 
        
        });
    }

    endSequence() {
        const main = document.querySelector('main');
        main.classList.add('unload'); 

        const botonReaccion = document.querySelector('main button:nth-of-type(2)');
        botonReaccion.disabled = false;
        botonReaccion.onclick = this.stopReaction.bind(this);
    }

    stopReaction(){
        this.clic_moment = new Date();

        const tiempo = this.clic_moment - this.unload_moment;
        
        var main = document.getElementsByTagName('main')[0];
        const p = document.createElement('p');
        const content = document.createTextNode("El tiempo de reacción ha sido: " + tiempo/1000 + " segundos ");
        p.appendChild(content);
        main.appendChild(p);
        
        main.classList.remove('unload');
        main.classList.remove('load');
       
        const botonReaccion = document.querySelector('main button:nth-of-type(2)');
        botonReaccion.disabled = true;
        const botonArranque = document.querySelector('main button:first-of-type');
        botonArranque.disabled = false;
    }


    createRecordForm(){
        var main = document.getElementsByTagName('main')[0];
        const formulario = document.createElement('form');
    }
}