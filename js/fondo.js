class Fondo {
    constructor(nombrePais, nombreCapital, nombreCircuito){
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.nombreCircuito = nombreCircuito;
    }

    obtenerImagenDeAPI(){
        var flickrAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.search";
    
        $.getJSON(flickrAPI, 
            {
                api_key: "ab1eef797fb77fd85257718f69df8896", 
                text: "hungary f1 hungaroring",
                format: "json",
                nojsoncallback: 1,
                per_page: 1 
            })
            .done(function(data) {
                if (data.photos.photo.length > 0) {
                    var photo = data.photos.photo[0];
                    var photoURL = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`; 
                    
                    $("body").css({
                        "background-image": `url(${photoURL})`,
                        "background-size": "cover",
                        "background-repeat": "no-repeat",
                        "min-height": "95vh"
                    });
                }
            });
    }
}
