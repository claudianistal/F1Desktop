import xml.etree.ElementTree as ET
import os

class SVGGenerator:
    def __init__(self, width=800, height=400, margin=50):
        self.width = width
        self.height = height
        self.margin = margin
        self.svg_elements = []

    def add_polyline(self, points, stroke_color="black", fill_color="none", stroke_width=2):
        """
        Añade una polilínea a la lista de elementos SVG.
        """
        points_str = " ".join([f"{x},{y}" for x, y in points])
        polyline = f'<polyline points="{points_str}" stroke="{stroke_color}" fill="{fill_color}" stroke-width="{stroke_width}" />'
        self.svg_elements.append(polyline)

    def generate_svg(self, filename):
        """
        Genera el archivo SVG con los elementos añadidos.
        """
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{self.height}">'
        svg_content += "\n".join(self.svg_elements)
        svg_content += '</svg>'
        
        with open(filename, 'w') as file:
            file.write(svg_content)
        print(f"Archivo SVG generado: {filename}")

def extraer_coordenadas_y_generar_svg(archivoXML):
    # Obtener la ruta completa y el directorio del archivo XML
    ruta_completa = os.path.abspath(archivoXML)
    directorio = os.path.dirname(ruta_completa)
    
    # Crear el nombre del archivo SVG en el mismo directorio
    archivoSVG = os.path.join(directorio, 'altimetria.svg')

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print(f'No se encuentra el archivo: {archivoXML}')
        return
    except ET.ParseError:
        print(f"Error procesando el archivo XML: {archivoXML}")
        return

    raiz = arbol.getroot()
    
    # Lista para almacenar los puntos del perfil altimétrico
    puntos = []
    min_altura, max_altura = float('inf'), float('-inf')
    
    # Recorrer los tramos del XML
    for tramo in raiz.findall('.//{http://www.uniovi.es}tramo'):
        coordenada_final = tramo.find('{http://www.uniovi.es}coordenadaFinal')

        if coordenada_final is not None:
            latitud = float(coordenada_final.find('{http://www.uniovi.es}latitud').text)
            longitud = float(coordenada_final.find('{http://www.uniovi.es}longitud').text)
            altura = float(coordenada_final.find('{http://www.uniovi.es}altura').text)

            # Actualizar la altitud mínima y máxima
            if altura < min_altura:
                min_altura = altura
            if altura > max_altura:
                max_altura = altura

            # Almacenar solo la altitud para el perfil
            puntos.append((longitud, altura))

    # Normalizar las coordenadas para ajustarlas al tamaño del SVG
    if not puntos:
        print("No se encontraron tramos con coordenadas.")
        return

    ancho_svg = 800  # Ancho del SVG
    alto_svg = 400   # Alto del SVG
    margen = 50  # Margen para dar espacio en los bordes
    escala_altura = (alto_svg - 2 * margen) / (max_altura - min_altura) if max_altura != min_altura else 1

    # Normalizar las longitudes para que encajen en el ancho
    longitudes = [x for x, y in puntos]
    min_long, max_long = min(longitudes), max(longitudes)
    escala_longitud = (ancho_svg - 2 * margen) / (max_long - min_long) if max_long != min_long else 1

    puntos_normalizados = []
    for longitud, altura in puntos:
        x = margen + (longitud - min_long) * escala_longitud
        y = alto_svg - margen - (altura - min_altura) * escala_altura
        puntos_normalizados.append((x, y))

    # Crear una polilínea SVG cerrada para simular el suelo
    svg_gen = SVGGenerator(width=ancho_svg, height=alto_svg, margin=margen)
    svg_gen.add_polyline(puntos_normalizados, stroke_color="blue", fill_color="lightgrey", stroke_width=2)

    # Generar el archivo SVG en el mismo directorio que el XML
    svg_gen.generate_svg(archivoSVG)

# Uso del código
archivoXML = 'C:\\Users\\Claudia\\OneDrive - Universidad de Oviedo\\3 Software\\Primer Cuatrimestre\\SEW\\SEW Lab\\F1Desktop\\xml\\circuitoEsquema.xml'
extraer_coordenadas_y_generar_svg(archivoXML)
