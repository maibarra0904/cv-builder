import { useState } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

export function PDFExporter() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  const downloadAsImage = async () => {
    setIsExportingImage(true);
    try {
      console.log('=== DOWNLOAD AS IMAGE START ===');
      const element = document.getElementById('cv-preview');
      if (!element) {
        console.error('CV preview element not found');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Elemento CV no encontrado',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }

      // Esperar fuentes y recursos
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Usar toda la altura real del contenido
      const width = element.offsetWidth;
      const height = element.scrollHeight;
      console.log('Exportando imagen con dimensiones:', width, 'x', height);

      // html2canvas con altura total
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width,
        height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: width,
        windowHeight: height,
        imageTimeout: 15000,
        removeContainer: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('cv-preview');
          if (clonedElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.position = 'static';
            clonedElement.style.transform = 'none';
            clonedElement.style.width = width + 'px';
            clonedElement.style.maxWidth = width + 'px';
            clonedElement.style.height = height + 'px';
            clonedElement.style.margin = '0 auto';
          }
        }
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.error('Canvas vacío');
        Swal.fire({
          icon: 'error',
          title: 'Error en captura',
          text: 'Canvas vacío - no se pudo capturar el contenido',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }

      // Convertir a PNG y descargar
      const imgData = canvas.toDataURL('image/png', 1.0);
      if (imgData === 'data:,') {
        console.error('Empty image data');
        Swal.fire({
          icon: 'error',
          title: 'Error de imagen',
          text: 'No se pudo generar la imagen',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }

      // Descargar
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'mi-cv.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Imagen descargada correctamente');
    } catch (error) {
      console.error('Image download error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al descargar',
        text: 'Error al descargar imagen: ' + (error instanceof Error ? error.message : String(error)),
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setIsExportingImage(false);
    }
  };

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    
    try {
      console.log('=== INICIO EXPORT PDF ALTA CALIDAD ===');
      
      const element = document.getElementById('cv-preview');
      if (!element) {
        console.error('CV preview element not found');
        Swal.fire({
          icon: 'error',
          title: 'Elemento no encontrado',
          text: 'No se encontró el elemento del CV para exportar',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }

      // Verificar que el elemento tenga contenido
      if (element.innerHTML.trim().length === 0) {
        console.error('CV preview element is empty');
        Swal.fire({
          icon: 'warning',
          title: 'CV vacío',
          text: 'El CV está vacío. Agrega contenido antes de exportar',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }

      // Esperar a que las fuentes se carguen completamente
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('=== CONFIGURACIÓN DE ALTA CALIDAD ===');
      
      // Obtener dimensiones reales del elemento
      const rect = element.getBoundingClientRect();
      console.log('Element dimensions:', rect.width, 'x', rect.height);

      // Configuración de alta calidad para html2canvas
      const highQualityOptions = {
        scale: 4, // Escala muy alta para máxima calidad
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false, // Desactivar logs para mejor rendimiento
        width: rect.width,
        height: rect.height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: rect.width,
        windowHeight: rect.height,
        imageTimeout: 30000, // Más tiempo para cargar
        removeContainer: false,
        foreignObjectRendering: false,
        // Configuraciones adicionales para mejor calidad
        letterRendering: true,
        onclone: (clonedDoc: Document) => {
          console.log('Clonando documento para alta calidad...');
          const clonedElement = clonedDoc.getElementById('cv-preview');
          if (clonedElement) {
            // Forzar estilos para máxima fidelidad
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.position = 'static';
            clonedElement.style.transform = 'none';
            clonedElement.style.setProperty('-webkit-font-smoothing', 'antialiased');
            clonedElement.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
            clonedElement.style.setProperty('text-rendering', 'optimizeLegibility');

            // Forzar el color de todos los enlaces para que coincidan con el renderizado
            const personalLinks = clonedElement.querySelectorAll('a');
            personalLinks.forEach((a) => {
              // Detectar el color computado en el documento original y aplicarlo en el clon
              try {
                // Buscar el enlace original por href y texto
                const href = a.getAttribute('href');
                const text = a.textContent;
                // Buscar en el documento original
                const originalLinks = document.querySelectorAll('a');
                let foundColor = '';
                originalLinks.forEach((origA) => {
                  if (origA.getAttribute('href') === href && origA.textContent === text) {
                    const style = window.getComputedStyle(origA);
                    foundColor = style.color;
                  }
                });
                if (foundColor) {
                  (a as HTMLElement).style.color = foundColor;
                }
              } catch (err) {
                console.warn('Error al obtener color de enlace:', err);
                // Si falla, usar color por clase
                if (a.classList.contains('text-gray-300')) {
                  (a as HTMLElement).style.color = '#d1d5db';
                }
                if (a.classList.contains('text-white')) {
                  (a as HTMLElement).style.color = '#fff';
                }
              }
            });

            // Aplicar estilos de alta calidad a todos los elementos hijos
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.setProperty('-webkit-font-smoothing', 'antialiased');
              htmlEl.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
              htmlEl.style.setProperty('text-rendering', 'optimizeLegibility');
            });
          }
        }
      };

      console.log('Generando canvas de alta calidad...');
      const canvas = await html2canvas(element, highQualityOptions);
      
      console.log('Canvas generado:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        console.error('Canvas vacío');
        Swal.fire({
          icon: 'error',
          title: 'Error de contenido',
          text: 'No se pudo generar el contenido para el PDF',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }

      // Dimensiones A4 en puntos (alta resolución)
      const A4_WIDTH_PT = 595.28; // A4 width in points (210mm)
      const A4_HEIGHT_PT = 841.89; // A4 height in points (297mm)
      
      // Calcular la escala para ajustar el contenido al ancho de A4 con margen más amplio
      const contentMargin = 0.95; // 95% del ancho para dejar márgenes mínimos
      const targetWidthPt = A4_WIDTH_PT * contentMargin;
      
      // Calcular altura proporcional
      const canvasAspectRatio = canvas.height / canvas.width;
      const targetHeightPt = targetWidthPt * canvasAspectRatio;
      
      // Si el contenido es más alto que A4, extender la página
      const finalHeight = Math.max(A4_HEIGHT_PT, targetHeightPt + 30); // +30pt para margen superior/inferior
      
      console.log(`PDF final: ${A4_WIDTH_PT}pt x ${finalHeight}pt`);
      console.log(`Contenido: ${targetWidthPt}pt x ${targetHeightPt}pt`);

      // Crear PDF con configuración de alta calidad
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt', // Usar puntos para mayor precisión
        format: [A4_WIDTH_PT, finalHeight],
        compress: false, // No comprimir para máxima calidad
        precision: 32, // Máxima precisión
        userUnit: 1.0
      });

      // Convertir canvas a imagen de máxima calidad
      const imgData = canvas.toDataURL('image/png', 1.0); // PNG sin pérdida de calidad
      
      // Centrar la imagen en la página
      const xOffset = (A4_WIDTH_PT - targetWidthPt) / 2;
      const yOffset = 15; // Margen superior de 15pt
      
      console.log('Añadiendo imagen al PDF...');
      
      // Añadir imagen con máxima calidad
      pdf.addImage(
        imgData, 
        'PNG', // PNG para mejor calidad que JPEG
        xOffset, 
        yOffset, 
        targetWidthPt, 
        targetHeightPt,
        '', // alias
        'FAST' // compresión rápida pero manteniendo calidad
      );

      // Agregar enlaces clickeables sobre la imagen
      console.log('Agregando enlaces interactivos...');
      const links = element.querySelectorAll('a[href]');
      links.forEach((link) => {
        const linkElement = link as HTMLAnchorElement;
        const linkRect = linkElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Calcular posición relativa del enlace en el PDF
        const relativeX = (linkRect.left - elementRect.left) / elementRect.width;
        const relativeY = (linkRect.top - elementRect.top) / elementRect.height;
        const relativeWidth = linkRect.width / elementRect.width;
        const relativeHeight = linkRect.height / elementRect.height;
        
        // Convertir a coordenadas del PDF
        const linkX = xOffset + (relativeX * targetWidthPt);
        const linkY = yOffset + (relativeY * targetHeightPt);
        const linkWidth = relativeWidth * targetWidthPt;
        const linkHeight = relativeHeight * targetHeightPt;
        
        // Agregar enlace clickeable
        pdf.link(linkX, linkY, linkWidth, linkHeight, { url: linkElement.href });
      });
      
      console.log('Guardando PDF de alta calidad...');
      pdf.save('mi-cv-alta-calidad.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: 'No se pudo generar el PDF. Por favor, inténtalo de nuevo',
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Botón para descargar como imagen */}
      <button
        onClick={downloadAsImage}
        disabled={isExportingImage}
        className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 text-sm md:text-base font-medium backdrop-blur-sm shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-600/25 hover:shadow-green-700/30 hover:scale-105"
      >
        {isExportingImage ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="hidden sm:inline">Generando...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Descargar PNG</span>
            <span className="sm:hidden">PNG</span>
          </>
        )}
      </button>
      
      <button
        onClick={exportToPDF}
        disabled={isExportingPDF}
        className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-5 py-2.5 rounded-lg transition-all duration-200 text-sm md:text-base font-medium backdrop-blur-sm shadow-lg ${
          isExportingPDF
            ? 'bg-gray-400 cursor-not-allowed text-white shadow-gray-400/25'
            : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-red-600/25 hover:shadow-red-700/30 hover:scale-105'
        }`}
      >
        {isExportingPDF ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="hidden sm:inline">Generando...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Descargar PDF</span>
            <span className="sm:hidden">PDF</span>
          </>
        )}
      </button>
    </div>
  );
}
