
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
        
        var body = document.getElementsByTagName('body')[0];
        var main = document.getElementsByTagName('main')[0];
        const p = document.createElement('p');
        const content = document.createTextNode("El tiempo de reacción ha sido: " + tiempo/1000 + " segundos ");
        p.appendChild(content);
        body.appendChild(p);
        
        main.classList.remove('unload');
        main.classList.remove('load');
       
        const botonReaccion = document.querySelector('main button:nth-of-type(2)');
        botonReaccion.disabled = true;
        const botonArranque = document.querySelector('main button:first-of-type');
        botonArranque.disabled = false;

        this.createRecordForm(tiempo);
    }


    createRecordForm(tiempoReaccion){
        var body = document.getElementsByTagName('body')[0];

        const formulario = document.createElement('form');
        formulario.action = "semaforo.php";
        formulario.method = "POST";

        const labelNombre = document.createElement('label');
        const nombre = document.createTextNode("Introduzca su nombre: ");
        labelNombre.appendChild(nombre);
        const textNombre = document.createElement('input');
        textNombre.name = "nombre";
        textNombre.required = true;
        formulario.appendChild(labelNombre);
        formulario.appendChild(textNombre);

        const labelApellidos = document.createElement('label');
        const apellido = document.createTextNode("Introduzca sus apellidos: ");
        labelApellidos.appendChild(apellido);
        const textApellidos = document.createElement('input');
        textApellidos.name = "apellidos";
        textApellidos.required = true;
        formulario.appendChild(labelApellidos);
        formulario.appendChild(textApellidos);

        const labelNivel = document.createElement('label');
        const nivel = document.createTextNode("Nivel de dificultad: ");
        labelNivel.appendChild(nivel);
        const textNivel = document.createElement('input');
        textNivel.name = "nivel";
        textNivel.value = this.difficulty;
        textNivel.readOnly = true; // Para que no se pueda modificar
        formulario.appendChild(labelNivel);
        formulario.appendChild(textNivel);

        const labelTiempo = document.createElement('label');
        const tiempo = document.createTextNode("Tiempo de reacción: ");
        labelTiempo.appendChild(tiempo);
        const textTiempo = document.createElement('input');
        textTiempo.name = "tiempo";
        textTiempo.value = tiempoReaccion/1000;
        textTiempo.readOnly = true; // Para que no se pueda modificar
        formulario.appendChild(labelTiempo);
        formulario.appendChild(textTiempo);

        const boton = document.createElement('button');
        boton.textContent = "Guardar en Base de Datos";
        boton.type = "submit";
        formulario.appendChild(boton);

        formulario.addEventListener('submit', function() {
            boton.disabled = true;
        });

        body.appendChild(formulario);
        
    }


    addToHTML(html){
        const place = document.querySelector("form");
        place.insertAdjacentHTML("afterend", html);
    }
}