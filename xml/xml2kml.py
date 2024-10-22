import xml.etree.ElementTree as ET
import os

class KMLGenerator:
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addPlacemark(self, nombre, descripcion, long, lat, alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm, 'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm, 'Point')
        ET.SubElement(punto, 'coordinates').text = '\n{},{},{}\n'.format(long, lat, alt)
        ET.SubElement(punto, 'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self, nombre, extrude, tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = '\n' + nombre + '\n'
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls, 'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls, 'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls, 'altitudeMode').text = '\n' + modoAltitud + '\n'

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = '\n' + color + '\n'
        ET.SubElement(linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self, nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)


def extraer_tramos_y_convertir_a_kml(archivoXML):
    # Obtener la ruta del archivo XML
    ruta_completa = os.path.abspath(archivoXML)
    
    # Extraer el directorio en el que se encuentra el archivo XML
    directorio = os.path.dirname(ruta_completa)
    
    # Crear el nombre del archivo KML basándonos en el nombre del archivo XML
    nombre_base = os.path.splitext(os.path.basename(archivoXML))[0]
    archivoKML = os.path.join(directorio, nombre_base + '.kml')

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivoXML)
        exit()

    raiz = arbol.getroot()
    
    # Instancia de KMLGenerator
    kml_gen = KMLGenerator()

    # Lista para almacenar todas las coordenadas finales de los tramos
    todas_las_coordenadas = []

    # Recorrer los tramos
    for tramo in raiz.findall('.//{http://www.uniovi.es}tramo'):
        sector = tramo.attrib.get('sector', 'Desconocido')
        distancia = tramo.attrib.get('distancia', 'Desconocida')
        coordenada_final = tramo.find('{http://www.uniovi.es}coordenadaFinal')

        if coordenada_final is not None:
            latitud = coordenada_final.find('{http://www.uniovi.es}latitud').text
            longitud = coordenada_final.find('{http://www.uniovi.es}longitud').text
            altitud = coordenada_final.find('{http://www.uniovi.es}altura').text

            # Nombre y descripción del tramo para el Placemark
            nombre = f"Tramo Sector {sector}"
            descripcion = f"Distancia: {distancia} m"

            # Agregar el punto de coordenada final como un Placemark
            kml_gen.addPlacemark(
                nombre=nombre,
                descripcion=descripcion,
                long=longitud,
                lat=latitud,
                alt=altitud,
                modoAltitud="absolute"
            )

            # Guardar la coordenada en la lista para construir la línea
            todas_las_coordenadas.append(f"{longitud},{latitud},{altitud}")

    # Unir todas las coordenadas en una sola cadena para la línea
    listaCoordenadas = ' '.join(todas_las_coordenadas)

    # Agregar la línea conectando todos los tramos
    kml_gen.addLineString(
        nombre="Ruta Completa",
        extrude="1",
        tesela="1",
        listaCoordenadas=listaCoordenadas,
        modoAltitud="absolute",
        color="ff0000ff",  # Azul en formato ABGR (alpha-blue-green-red)
        ancho="2"
    )

    # Guardar el archivo KML en el mismo directorio que el XML
    kml_gen.escribir(archivoKML)
    print(f"Archivo KML generado: {archivoKML}")

# Uso del código
archivoXML = 'C:\\Users\\Claudia\\OneDrive - Universidad de Oviedo\\3 Software\\Primer Cuatrimestre\\SEW\\SEW Lab\\F1Desktop\\xml\\circuitoEsquema.xml'
extraer_tramos_y_convertir_a_kml(archivoXML)
