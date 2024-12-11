<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Formula 1</title>
    <meta name ="author" content ="Claudia Nistal" />
    <meta name ="description" content ="Documento en el que se podrán comparar dos Pilotos de F1" />
    <meta name ="keywords" content ="Juego, Piloto, Equipo, Carreras" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/comparadorPilotos.css" />
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
        }

        public function getConnection(){
            try {
                $this->conn = new PDO("mysql:host={$this->server};dbname={$this->dbname}", $this->user, $this->pass);
            } catch (PDOException $e) {
                throw $e;
            }
        }

        public function initBDD($filePath){
            try {
                $this->conn = new PDO("mysql:host={$this->server}", $this->user, $this->pass);
                $sqlContent = file_get_contents($filePath);
        
                $sqlStatements = array_filter(array_map('trim', explode(';', $sqlContent)));
        
                foreach ($sqlStatements as $statement) {
                    if (!empty($statement)) {
                        $this->conn->exec($statement);
                    }
                }
                
                echo "Base de datos y tablas creadas correctamente desde el archivo .sql.";
            } catch (PDOException $e) {
                die ("Error al inicializar la base de datos: " . $e->getMessage());
            }
        }

        
        
        public function importCSV($file) {
            try{
                $this->getConnection();
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
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
            }
                
        }

        private function insertData($table, $columns, $data) {
            $columnsList = implode(',', $columns);
            $placeholders = implode(',', array_fill(0, count($columns), '?'));
            $update = implode(',', array_map(fn($col) => "$col = VALUES($col)", $columns)); 
            $sql = "INSERT INTO $table ($columnsList) VALUES ($placeholders) ON DUPLICATE KEY UPDATE $update";
            $stmt = $this->conn->prepare($sql);
        
            foreach ($data as $row) {
                try {
                    $stmt->execute($row);
                } catch (Exception $e) {
                    echo "Error al insertar/actualizar en la tabla $table: " . $e->getMessage() . "\n";
                }
            }
        }


        public function exportCSV() {
            try {
                $this->getConnection();
                $filename = "exported_data.csv";
                
                // Me aseguro de que no hay salida previa del html
                if (ob_get_length()) {
                    ob_clean();
                }
            
                // Estabelzco las cabeceras para la descarga
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename=' . $filename);
            
                // Abro un flujo de salida
                $output = fopen('php://output', 'w');
            
                $tables = ['equipo', 'circuito', 'piloto', 'carrera', 'resultado'];
            
                foreach ($tables as $table) {
                    fputcsv($output, ["#Tabla: $table"]);
                    // Obtener los nombres de las columnas de la tabla
                    $columnsQuery = $this->conn->query("SHOW COLUMNS FROM $table");
                    $columns = $columnsQuery->fetchAll(PDO::FETCH_COLUMN);
                    fputcsv($output, $columns);
                    // Obtener los datos de la tabla
                    $dataQuery = $this->conn->query("SELECT * FROM $table");
                    $data = $dataQuery->fetchAll(PDO::FETCH_NUM);
            
                    foreach ($data as $row) {
                        fputcsv($output, $row);
                    }
                    //Añadir una línea en blanco entre tablas
                    fputcsv($output, []);
                }
                
                fclose($output);
            
                // Finalizo la ejecución del script
                exit;
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
            }
           
        }

        public function obtenerPilotos() {
            try{
                $this->getConnection();
                $stmt = $this->conn->query("SELECT id_piloto, CONCAT(nombre, ' ', apellido) AS nombre_completo FROM piloto");
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
            }
        }

        public function obtenerResultados($idPiloto) {
            try{
                $this->getConnection();
                $stmt = $this->conn->prepare("
                        SELECT c.nombre_carrera, r.posicion, r.tiempo 
                        FROM resultado r 
                        JOIN carrera c ON r.id_carrera = c.id_carrera 
                        WHERE r.id_piloto = :id_piloto
                ");
                $stmt->execute([':id_piloto' => $idPiloto]);
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
            } 
        }

        public function obtenerInformacionPiloto($idPiloto) {
            try{
                $this->getConnection();
                $stmt = $this->conn->prepare("
                        SELECT p.nombre, p.apellido, p.nacionalidad, e.nombre_equipo 
                        FROM piloto p
                        JOIN equipo e ON p.id_equipo = e.id_equipo
                        WHERE p.id_piloto = :id_piloto
                ");
                $stmt->execute([':id_piloto' => $idPiloto]);
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
            }
            
        }

        public function printInfoPilotos(){
            try{
                $this->getConnection();
                $infoPiloto1 = $this->obtenerInformacionPiloto($_POST['piloto1']);
                $infoPiloto2 = $this->obtenerInformacionPiloto($_POST['piloto2']);

                echo "<section>";
                echo "<h3>Información de Pilotos</h3>";
                
                echo "<h4>Piloto 1:</h4>";
                echo "<ul>";
                echo "<li><strong>Nombre:</strong> {$infoPiloto1['nombre']} {$infoPiloto1['apellido']}</li>";
                echo "<li><strong>Nacionalidad:</strong> {$infoPiloto1['nacionalidad']}</li>";
                echo "<li><strong>Equipo:</strong> {$infoPiloto1['nombre_equipo']}</li>";
                echo "</ul>";

                echo "<h4>Piloto 2:</h4>";
                echo "<ul>";
                echo "<li><strong>Nombre:</strong> {$infoPiloto2['nombre']} {$infoPiloto2['apellido']}</li>";
                echo "<li><strong>Nacionalidad:</strong> {$infoPiloto2['nacionalidad']}</li>";
                echo "<li><strong>Equipo:</strong> {$infoPiloto2['nombre_equipo']}</li>";
                echo "</ul>";
                echo "</section>";
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
            }
            
        }
        

        public function compararPilotos($piloto1, $piloto2) {
            try{
                $this->getConnection();
                $resultados1 = $this->obtenerResultados($piloto1);
                $resultados2 = $this->obtenerResultados($piloto2);

                // Unir todas las carreras únicas de ambos pilotos
                $carreras = array_unique(array_merge(
                    array_column($resultados1, 'nombre_carrera'),
                    array_column($resultados2, 'nombre_carrera')
                ));

                // Mostrar los resultados en una tabla
                echo "<table>";
                echo "<tr><th>Carrera</th><th>Piloto 1 (Pos/Tiempo)</th><th>Piloto 2 (Pos/Tiempo)</th></tr>";
                
                foreach ($carreras as $carrera) {
                    $r1 = array_values(array_filter($resultados1, fn($r) => $r['nombre_carrera'] === $carrera));
                    $r2 = array_values(array_filter($resultados2, fn($r) => $r['nombre_carrera'] === $carrera));

                    $pos1 = $r1[0]['posicion'] ?? '-';
                    $time1 = $r1[0]['tiempo'] ?? '-';
                    $pos2 = $r2[0]['posicion'] ?? '-';
                    $time2 = $r2[0]['tiempo'] ?? '-';

                    echo "<tr>";
                    echo "<td>$carrera</td>";
                    echo "<td>$pos1 / $time1</td>";
                    echo "<td>$pos2 / $time2</td>";
                    echo "</tr>";
                }
            
                echo "</table>";
            } catch (Exception $e) {
                echo "La base de datos no ha sido inicializada.";
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
        Estás en: <a href="index.html" title="Página principal">[Índice]</a> >> <a href="juegos.html" title="Página de Juegos">[Juegos]</a> >> [Comparador de Pilotos]
    </p>
    <!-- Sección del menú de juegos -->
    <section id="menu-juegos">
        <h2>Menú de Juegos</h2>
        <ul>
            <li><a href="memoria.html" title="Juego de Memoria">Juego de Memoria</a></li>
            <li><a href="semaforo.php" title="Juego del Semáforo">Juego del Semáforo</a></li>
            <li><a href="api.html" title="Ejercicio apis">Minijuegos (API)</a></li>
            <li><a href="comparadorPilotos.php" title="Compara los Resultados de los Pilotos">Compara los Resultados de los Pilotos</a></li>
        </ul>
    </section>
    
    <main>
        <h2> Compara los Resultados de los Pilotos de F1 </h2>

        <section>
            <h3> Inicializa la Base de Datos </h3>
            <form  method="POST">
                <button type="submit" name="init" title="Inicia BDD">Inicia Base de Datos</button>
            </form>

            <?php
                if (isset($_POST['init'])) {
                    $db = new Database();
                    $filePath = "PHP/formula1.sql";
                    $db->initBDD($filePath);
                }
            ?>
        
        </section>

        <section>
            <h3> Importar datos </h3>
            <form  method="POST" enctype="multipart/form-data">
                <label for="csvFile">Importar archivo CSV:</label>
                <input type="file" name="csvFile" id="csvFile" title="Importar .csv" required>
                <button type="submit" name="import">Importar</button>
            </form>
            
            <?php
                if (isset($_POST['import'])) {
                    $db = new Database();
                    $db->importCSV($_FILES['csvFile']);
                }
            ?>
        </section>
        <section>
            <h3> Exportar datos </h3>
            <form method="POST">
                <button type="submit" name="export" title="Exportar datos">Exportar</button>
            </form>

            <?php
                if (isset($_POST['export'])) {
                    $db = new Database();
                    $db->exportCSV();
                    exit;
                }
            ?>
        </section>


        <hr>
        
        <section>
            <h3> Comparar Pilotos </h3>
            <form method="POST">
                <label for="piloto1">Piloto 1:</label>
                <select name="piloto1" id = "piloto1" required>
                    <option value="" disabled selected>Seleccione un piloto</option>
                    <?php
                        $db = new Database();
                        $pilotos = $db->obtenerPilotos();
                        if (empty($pilotos)) {
                            echo "<option>No hay pilotos disponibles</option>";
                        } else {
                            foreach ($pilotos as $piloto) {
                                echo "<option value='{$piloto['id_piloto']}'>{$piloto['nombre_completo']}</option>";
                            }
                        }
                    ?>
                </select>
                <label for="piloto2">Piloto 2:</label>
                <select name="piloto2" id = "piloto2"required>
                    <option value="" disabled selected>Seleccione un piloto</option>
                    <?php
                        $db = new Database();
                        $pilotos = $db->obtenerPilotos();
                        if (empty($pilotos)) {
                            echo "<option>No hay pilotos disponibles</option>";
                        } else {
                            foreach ($pilotos as $piloto) {
                                echo "<option value='{$piloto['id_piloto']}'>{$piloto['nombre_completo']}</option>";
                            }
                        }
                    ?>
                </select>
                <button type="submit" name="compare">Comparar</button>
            </form>

            <?php
                if (isset($_POST['compare'])) {
                    $db = new Database();
                    $db->printInfoPilotos();
                    $db->compararPilotos($_POST['piloto1'], $_POST['piloto2']);
                }
            ?>
        </section>

        
    </main>
   
</body>

</html>