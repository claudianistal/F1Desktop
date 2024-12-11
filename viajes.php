<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Formula 1</title>
    <meta name ="author" content ="Claudia Nistal" />
    <meta name ="description" content ="Documento en el que se mostrarán los viajes donde tendrán lugar las carreras" />
    <meta name ="keywords" content ="Formula 1, Viaje, Lugar, Ciudad, Vuelo, Avión, Hotel" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" type="image/ico" href="multimedia/imagenes/favicon.ico" />
    <script src="js/viajes.js"></script>
    <link defer href="https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css" rel="stylesheet" />
    <script defer src="https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js"></script>

</head>

<?php
    class Carrusel {
        protected $pais;
        protected $capital;
        protected $imagenes = [];

        public function __construct($pais, $capital) {
            $this->pais = $pais;
            $this->capital = $capital;
        }

        function getImages(){
            $api_key = 'ab1eef797fb77fd85257718f69df8896';
            $tag = $this->pais . ',' . $this->capital;
            $perPage = 10;
            $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
            $url.= '&api_key='.$api_key;
            $url.= '&tags='.$tag;
            $url.= '&per_page='.$perPage;
            $url.= '&format=json';
            $url.= '&nojsoncallback=1';

            $respuesta = file_get_contents($url);
            if ($respuesta) {
                $json = json_decode($respuesta);
    
                if ($json && isset($json->items)) {
                    foreach ($json->items as $item) {
                        $largeImageURL = $item->media->m;
                        $imgTag = '<img src="' . htmlspecialchars($largeImageURL) . '" alt="' . htmlspecialchars($item->title) . '" />';
                        $this->imagenes[] = $imgTag;
                    }
                } 
            }
        }

        public function getImagenesGuardadas() {
            return $this->imagenes;
        }
    }

    class Moneda {
        protected $monedaCambio;    //EUR
        protected $monedaLocal;     //HUF

        function __construct($monedaCambio, $monedaLocal) {
            $this->monedaCambio = $monedaCambio;
            $this->monedaLocal = $monedaLocal;
        }

        function getInfoCambio(){
            $url = 'https://api.exchangerate-api.com/v4/latest/' . $this->monedaCambio;
            $respuesta = file_get_contents($url);
            if ($respuesta) {
                $json = json_decode($respuesta);
                if ($json && isset($json->rates)) {
                    $cambio = $json->rates->{$this->monedaLocal};
                    echo '<h4> La moneda local en Hungría es el florín húngaro (HUF) y su equivalencia en euros (EUR) es la siguiente: </h4>';
                    echo '<p>1 ' . $this->monedaCambio . ' = ' . $cambio . ' ' . $this->monedaLocal . '</p>';
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
            <a href="viajes.php" title="enlace al documento viajes.html" class="active">Viajes</a> 
            <a href="juegos.html" title="enlace al documento juegos.html">Juegos</a>   
        </nav>
    </header>
    <p>
        Estás en: <a href = "index.html" title="Página principal">[Índice]</a> >> [Viajes]
    </p>
    <h2>Viajes</h2>
    <main>
        <input type="button" value="Obtener mapa estático" onclick = "viaje.getMapaEstatico()"/>
        <input type="button" value="Obtener mapa dinámico" onclick = "viaje.getMapaDinamico()"/>
        
        
        <article>
            <h3>Mapa Estático</h3>
        </article>
        <h3>Mapa Dinámico</h3>
        <div>
            
        </div>

        <article>
            <h3> Imágenes de Hungría, Budapest </h3>
            <?php 
                $carrusel = new Carrusel("Hungria", "Budapest");

                $carrusel->getImages();

                $imagenes = $carrusel->getImagenesGuardadas();
                foreach ($imagenes as $imgTag) {
                    echo $imgTag;
                }
            ?>
            <button> &gt; </button>
            <button> &lt; </button>
        </article>
        <script>
                viaje.initCarrusel();
        </script>

        <article>
            <h3> Cambio de moneda </h3>
            <?php
                $moneda = new Moneda("EUR", "HUF");
                $moneda->getInfoCambio();
            ?>
        </article>
     
    </main>
</body>

</html>