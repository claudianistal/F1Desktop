class Memoria {

    constructor() {
        // Atributos iniciales
        this.hasFlippedCard = false;  // Indica si hay una carta dada la vuelta
        this.lockBoard = false;        // Indica si el tablero está bloqueado
        this.firstCard = null;         // Primera carta dada la vuelta
        this.secondCard = null;        // Segunda carta dada la vuelta

        //Elemento JSON
        this.elements = {
            "cards": [
                {
                    "element": "RedBull",
                    "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
                },
                {
                    "element": "RedBull",
                    "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
                },
                {
                    "element": "McLaren",
                    "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
                },
                {
                    "element": "McLaren",
                    "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
                },
                {
                    "element": "Alpine",
                    "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
                },
                {
                    "element": "Alpine",
                    "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
                },
                {
                    "element": "Aston Martin",
                    "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
                },
                {
                    "element": "Aston Martin",
                    "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
                },
                {
                    "element": "Ferrari",
                    "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
                },
                {
                    "element": "Ferrari",
                    "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
                },
                {
                    "element": "Mercedes",
                    "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
                },
                {
                    "element": "Mercedes",
                    "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
                }
            ]
        };

        // Llamadas a los métodos
        this.shuffleElements(); 
        this.createElements();
        this.addEventListeners();
    }

    //Método que recorre el objeto JSON y crea un nodo article para cada tarjeta
    createElements() {
        var gameBoard = document.querySelector("section:nth-of-type(2)");
    
        this.elements.cards.forEach(card => {
            var article = document.createElement("article");
            article.setAttribute("data-element", card.element);
            //article.setAttribute('data-state', 'hidden'); // Inicializo el estado
    
            var header = document.createElement("h3");
            header.textContent = "Tarjeta de memoria";
            article.appendChild(header);
    
            var img = document.createElement("img");
            img.setAttribute("src", card.source);
            img.setAttribute("alt", card.element);
            article.appendChild(img);
    
            gameBoard.appendChild(article);
        });
    }

     // Método para barajar los elementos
     shuffleElements() {
        var { cards } = this.elements;
        for (let i = cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    // Método para voltear las cartas que están boca arriba y resetear el tablero
    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.setAttribute('data-state', 'unflip');
            this.secondCard.setAttribute('data-state', 'unflip');
            this.resetBoard(); 
        }, 1000); // Esperar 1 segundo antes de voltear las cartas
    }

    // Método para resetear el tablero
    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    // Método para comprobar si las cartas volteadas son iguales
    checkForMatch() {
        var isMatch = this.firstCard.getAttribute('data-element') === this.secondCard.getAttribute('data-element');
        isMatch ? this.disableCards() : this.unflipCards();
    }

    // Método para deshabilitar las interacciones sobre las cartas emparejadas
    disableCards() {
        this.firstCard.setAttribute('data-state', 'revealed');
        this.secondCard.setAttribute('data-state', 'revealed');
        this.resetBoard(); 
    }

    addEventListeners() {
        const cards = document.querySelectorAll("section:nth-of-type(2) > article");
    
        cards.forEach(card => {
            card.onclick = this.flipCard.bind(card, this)
        });
    }

    flipCard(game) {
        // Comprobaciones iniciales
        if (this.getAttribute('data-state') === 'revealed') {
            return; 
        }
    
        if (game.lockBoard) {
            return; 
        }
    
        if (game.firstCard === this) {
            return; 
        }
    
        
        this.setAttribute('data-state', 'flip');
    
        // Comprobar si ya hay una tarjeta volteada
        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = this; 
        } else {
            game.secondCard = this;
            game.checkForMatch();
        }
    }
    
}

class ReglasJuego {
    constructor() {
        this.modal = document.querySelector("section:nth-of-type(2) > section");
        this.closeButton = this.modal.querySelector("button");
        this.parentSection = document.querySelector("section:nth-of-type(2)");

        this.addEventListeners();
    }

    // Muestra la ventana modal
    showModal() {
        this.modal.removeAttribute("hidden");
    }

    // Oculta la ventana modal 
    hideModal() {
        this.modal.setAttribute("hidden", "");
    }

    // Asigna el evento a los botones
    addEventListeners() {
        const rulesButton = document.querySelector("section:nth-of-type(2) > button");

        rulesButton.addEventListener("click", () => {
            this.showModal();
        });

        this.closeButton.addEventListener("click", () => {
            this.hideModal();
        });
    }
}
    
