import xml.etree.ElementTree as ET
import os

class SVGGenerator:
    def __init__(self, width=800, height=400, margin=50):
        self.width = width
        self.height = height
        self.margin = margin
        self.svg_elements = []

    def add_polyline(self, points, stroke_color="blue", fill_color="lightblue", stroke_width=2):
        """
        Añade una polilínea cerrada para el perfil altimétrico, simulando el suelo en el gráfico.
        """
        points_str = " ".join([f"{x},{y}" for x, y in points])
        polyline = f'<polyline points="{points_str}" stroke="{stroke_color}" fill="{fill_color}" stroke-width="{stroke_width}" />'
        self.svg_elements.append(polyline)

    def generate_svg(self, filename):
        """
        Genera el archivo SVG con los elementos añadidos.
        """
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg">'
        svg_content += "\n".join(self.svg_elements)
        svg_content += '</svg>'
        
        with open(filename, 'w') as file:
            file.write(svg_content)
        print(f"Archivo SVG generado: {filename}")

def extraer_alturas_y_generar_svg(archivoXML):
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
    
    # Lista para almacenar las alturas
    alturas = []
    max_altura = float('-inf')
    
    # Recorrer los tramos del XML y extraer solo las alturas
    for tramo in raiz.findall('.//{http://www.uniovi.es}tramo'):
        coordenada_final = tramo.find('{http://www.uniovi.es}coordenadaFinal')

        if coordenada_final is not None:
            altura = float(coordenada_final.find('{http://www.uniovi.es}altura').text)
            
            # Actualizar la altura máxima
            if altura > max_altura:
                max_altura = altura

            # Añadir la altura a la lista
            alturas.append(altura)

    # Normalizar las alturas para que el mínimo sea 0
    if not alturas:
        print("No se encontraron tramos con alturas.")
        return

    ancho_svg = 800  # Ancho del SVG
    alto_svg = 400   # Alto del SVG
    margen = 50  # Margen para dar espacio en los bordes
    escala_altura = (alto_svg - 2 * margen) / max_altura if max_altura != 0 else 1

    # Generar puntos (x, y) para el perfil altimétrico en función de la altura
    puntos_normalizados = []
    for i, altura in enumerate(alturas):
        x = margen + i * ((ancho_svg - 2 * margen) / (len(alturas) - 1))
        y = alto_svg - margen - altura * escala_altura  # Altura normalizada desde la base (0)
        puntos_normalizados.append((x, y))

    # Cerrar el polígono para simular el suelo
    puntos_normalizados.append((ancho_svg - margen, alto_svg - margen))  # Extremo derecho en la línea de suelo
    puntos_normalizados.insert(0, (margen, alto_svg - margen))           # Extremo izquierdo en la línea de suelo

    # Crear el gráfico SVG
    svg_gen = SVGGenerator(width=ancho_svg, height=alto_svg, margin=margen)
    svg_gen.add_polyline(puntos_normalizados, stroke_color="blue", fill_color="lightblue", stroke_width=2)

    # Generar el archivo SVG en el mismo directorio que el XML
    svg_gen.generate_svg(archivoSVG)

# Uso del código
archivoXML = 'C:\\Users\\Claudia\\OneDrive - Universidad de Oviedo\\3 Software\\Primer Cuatrimestre\\SEW\\SEW Lab\\F1Desktop\\xml\\circuitoEsquema.xml'  
extraer_alturas_y_generar_svg(archivoXML)
