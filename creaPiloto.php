<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Formula 1</title>
    <meta name ="author" content ="Claudia Nistal" />
    <meta name ="description" content ="Documento en el que se podrá crear un nuevo piloto de F1" />
    <meta name ="keywords" content ="Juego, Piloto, Equipo, Carreras" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" type="image/ico" href="multimedia/imagenes/favicon.ico" />
</head>

<?php
    class Database{
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
            $this->dbname = "formula1";

            try {
                $this->conn = new PDO("mysql:host={$this->server}", $this->user, $this->pass);
                $this->crearBaseDeDatos();
                $this->conn = new PDO("mysql:host={$this->server};dbname={$this->dbname}", $this->user, $this->pass);
            } catch (PDOException $e) {
                die("Error de conexión: " . $e->getMessage());
            }
        }

        function crearBaseDeDatos(){
            $sql = "CREATE DATABASE IF NOT EXISTS formula1";
            $this->conn->exec($sql);
        }

        public function createTables() {
            $sql = [
                "CREATE DATABASE IF NOT EXISTS formula1;",
                "USE formula1;",
                // Tabla Equipos
                "CREATE TABLE IF NOT EXISTS equipo (
                    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
                    nombre_equipo VARCHAR(50) NOT NULL,
                    pais_origen VARCHAR(50) NOT NULL
                );",
                // Tabla Circuitos
                "CREATE TABLE IF NOT EXISTS circuito (
                    id_circuito INT AUTO_INCREMENT PRIMARY KEY,
                    nombre_circuito VARCHAR(50) NOT NULL,
                    localizacion VARCHAR(50) NOT NULL,
                    longitud FLOAT,
                    capacidad INT
                );",
                // Tabla Pilotos
                "CREATE TABLE IF NOT EXISTS piloto (
                    id_piloto INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL,
                    apellido VARCHAR(50) NOT NULL,
                    nacionalidad VARCHAR(50) NOT NULL,
                    id_equipo INT,
                    FOREIGN KEY (id_equipo) REFERENCES equipo(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE
                );",
                // Tabla Carreras
                "CREATE TABLE IF NOT EXISTS carrera (
                    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
                    nombre_carrera VARCHAR(50) NOT NULL,
                    fecha DATE NOT NULL,
                    pais VARCHAR(50) NOT NULL,
                    id_circuito INT,
                    FOREIGN KEY (id_circuito) REFERENCES circuito(id_circuito) ON DELETE CASCADE ON UPDATE CASCADE
                );",
                // Tabla Resultados
                "CREATE TABLE IF NOT EXISTS resultado (
                    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
                    id_piloto INT,
                    id_carrera INT,
                    posicion INT NOT NULL,
                    tiempo TIME,
                    FOREIGN KEY (id_piloto) REFERENCES piloto(id_piloto) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_carrera) REFERENCES carrera(id_carrera) ON DELETE CASCADE ON UPDATE CASCADE
                );"
            ];
        
            foreach ($sql as $query) {
                $this->conn->exec($query);
            }
        }
        
        public function importCSV($file) {
                $filePath = $file['tmp_name'];
                $currentTable = null;
                $columns = [];
                $data = [];
                $file = fopen($filePath, 'r');
        
                while (($line = fgetcsv($file)) !== false) {
                    if (empty($line[0])) continue;
        
                    // Aqui se detecta el inicio de una nueva tabla
                    if (strpos($line[0], '#Tabla:') === 0) {
                        // Si ya hay datos acumulados, insertar en la base de datos
                        if ($currentTable !== null && !empty($data)) {
                            $this->insertData($currentTable, $columns, $data);
                        }
        
                        // Configurar la nueva tabla
                        $currentTable = trim(substr($line[0], 7));
                        $columns = [];
                        $data = [];
                    } 
                    // Detectar encabezados de columnas
                    elseif ($currentTable && empty($columns)) {
                        $columns = $line;
                    } 
                    // Acumular datos
                    else {
                        $data[] = $line;
                    }
                }
        
                // Insertar los últimos datos acumulados
                if ($currentTable !== null && !empty($data)) {
                    $this->insertData($currentTable, $columns, $data);
                }
        
                fclose($file);
        }

        private function insertData($table, $columns, $data) {
            $columnsList = implode(',', $columns);
            $placeholders = implode(',', array_fill(0, count($columns), '?'));
            $sql = "INSERT INTO $table ($columnsList) VALUES ($placeholders)";
            $stmt = $this->conn->prepare($sql);
    
            foreach ($data as $row) {
                try {
                    $stmt->execute($row);
                } catch (Exception $e) {
                    echo "Error al insertar en la tabla $table: " . $e->getMessage() . "\n";
                }
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
        Estás en: <a href="index.html" title="Página principal">[Índice]</a> >> <a href="juegos.html" title="Página de Juegos">[Juegos]</a> >> [Crea tu Piloto]
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
        <h2> Crea tu Piloto de F1 </h2>
        <form action="" method="POST" enctype="multipart/form-data">
            <label for="csvFile">Importar archivo CSV:</label>
            <input type="file" name="csvFile" title="Importar .csv" required>
            <button type="submit">Importar</button>
        </form>

        <?php
            if (isset($_POST['submit']) && isset($_FILES['csvFile'])) {
                $db = new Database();
                $db->createTables();
                $db->importCSV($_FILES['csvFile']);
            }
        ?>


    </main>
   
</body>

</html>