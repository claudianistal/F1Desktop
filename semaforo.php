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
        protected $conn;
        public function __construct()
        {
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";

            try {
                $this->conn = new PDO("mysql:host={$this->server};dbname={$this->dbname}", $this->user, $this->pass);
            } catch (PDOException $e) {
                die("Error de conexión: " . $e->getMessage());
            }
        }
        
        public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
            try {
                $sql = "INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (:nombre, :apellidos, :nivel, :tiempo)";
                $dbh = $this->conn->prepare($sql);
    
                $dbh->bindParam(':nombre', $nombre, PDO::PARAM_STR);
                $dbh->bindParam(':apellidos', $apellidos, PDO::PARAM_STR);
                $dbh->bindParam(':nivel', $nivel, PDO::PARAM_STR);
                $dbh->bindParam(':tiempo', $tiempo, PDO::PARAM_STR);
    
                $dbh->execute();
            } catch (PDOException $e) {
                echo "Error al guardar el registro: " . $e->getMessage();
            }
        }

        public function getTopRecords($nivel, $limit = 10) {
            try {
                $sql = "SELECT nombre, apellidos, tiempo 
                        FROM registro 
                        WHERE nivel = :nivel 
                        ORDER BY tiempo ASC 
                        LIMIT $limit";

                $stmt = $this->conn->prepare($sql);

                $stmt->bindValue(':nivel', $nivel, PDO::PARAM_STR);
               
                $stmt->execute();
    
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                echo "Error al obtener los mejores récords: " . $e->getMessage();
                return [];
            }
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
            <a href="viajes.php" title="enlace al documento viajes.html">Viajes</a> 
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
            <li><a href="creaPiloto.php" title="Crea tu Piloto de F1">Crea tu Piloto de F1</a></li>
        </ul>
    </section>
    
    <main>
        
    </main>

    <script>
        const juegoSemaforo = new Semaforo();
    </script>

    <?php
    if (count($_POST) == 4) {
        $nombre = $_POST['nombre'] ?? '';
        $apellidos = $_POST['apellidos'] ?? '';
        $nivel = $_POST['nivel'] ?? '';
        $tiempo = $_POST['tiempo'] ?? '';

        $record = new Record();

        $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

        $topRecords = $record->getTopRecords($nivel);
        
        echo "<section>";
        echo "<h3>Top 10 Récords (Nivel: $nivel)</h3>";
        echo "<ol>";

        foreach ($topRecords as $row) {
            $nombreCompleto = htmlspecialchars($row['nombre'] . ' ' . $row['apellidos']);
            $tiempoSegundos = htmlspecialchars($row['tiempo']);
            echo "<li>$nombreCompleto - $tiempoSegundos segundos</li>";
        }

        echo "</ol>";
        echo "</section>";
    }
?>
   
</body>

</html>