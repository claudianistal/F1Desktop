<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Formula 1</title>
    <meta name ="author" content ="Claudia Nistal" />
    <meta name ="description" content ="Documento en el que se podrá jugar al juego del Semáforo" />
    <meta name ="keywords" content ="Juego, Partida, Inicio, Fin, Puntuación" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />
    <link rel="icon" type="image/ico" href="multimedia/imagenes/favicon.ico" />
    <script src="js/semaforo.js" type="text/javascript"></script>
</head>

<?php
    class Record {
        protected $server;
        protected $user;
        protected $pass;
        protected $dbname;
        public function __construct()
        {
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";
        }
        
    }

?>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <a href = "index.html" title = "Enlace a la página principal"><h1>F1 Desktop</h1></a>
        <nav> 
            <a href="index.html" title="enlace al documento index.html">Índice</a> 
            <a href="piloto.html" title="enlace al documento piloto.html">Piloto</a> 
            <a href="noticias.html" title="enlace al documento noticias.html">Noticias</a> 
            <a href="calendario.html" title="enlace al documento calendario.html">Calendario</a> 
            <a href="metereologia.html" title="enlace al documento metereologia.html">Metereología</a> 
            <a href="circuito.html" title="enlace al documento circuito.html">Circuito</a> 
            <a href="viajes.html" title="enlace al documento viajes.html">Viajes</a> 
            <a href="juegos.html" title="enlace al documento juegos.html" class="active">Juegos</a> 
        </nav>
    </header>

    <p>
        Estás en: <a href="index.html" title="Página principal">[Índice]</a> >> <a href="juegos.html" title="Página de Juegos">[Juegos]</a> >> [Juego del Semáforo]
    </p>
    <!-- Sección del menú de juegos -->
    <section id="menu-juegos">
        <h2>Menú de Juegos</h2>
        <ul>
            <li><a href="memoria.html" title="Juego de Memoria">Juego de Memoria</a></li>
            <li><a href="semaforo.html" title="Juego del Semáforo">Juego del Semáforo</a></li>
            <li><a href="api.html" title="Ejercicio apis">Api</a></li>
        </ul>
    </section>
    
    <main>
        
    </main>
    
    <script>
        const juegoSemaforo = new Semaforo();
    </script>
</body>

</html>