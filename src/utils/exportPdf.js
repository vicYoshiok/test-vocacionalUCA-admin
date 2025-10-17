// src/utils/exportPdf.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Instalar las dependencias si no las tienes:
// npm install jspdf html2canvas

export const exportResultsToPdf = async (data) => {
  try {
    // Crear un elemento temporal para el PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm'; // A4 width
    pdfContainer.style.padding = '20px';
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    
    document.body.appendChild(pdfContainer);

    // Generar el contenido HTML del PDF
    pdfContainer.innerHTML = generatePdfContent(data);

    // Esperar a que las imágenes se carguen
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convertir a canvas y luego a PDF
    const canvas = await html2canvas(pdfContainer, {
      scale: 2, // Mejor calidad
      useCORS: true,
      logging: false,
      width: pdfContainer.offsetWidth,
      height: pdfContainer.offsetHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Agregar páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Guardar el PDF
    const fileName = `Test_Vocacional_${data.usuario.nombre}_${data.usuario.lastname}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    // Limpiar el elemento temporal
    document.body.removeChild(pdfContainer);

  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF: ' + error.message);
  }
};

const generatePdfContent = (data) => {
  const areas = {
    R: { name: "Realista", color: "#E74C3C", description: "Personas prácticas, activas y enfocadas en el hacer. Prefieren tareas físicas, técnicas o manuales." },
    I: { name: "Investigador", color: "#3498DB", description: "Personas analíticas, lógicas y observadoras. Disfrutan investigar y resolver problemas complejos." },
    A: { name: "Artístico", color: "#9B59B6", description: "Personas imaginativas, creativas y expresivas. Disfrutan comunicar ideas y emociones." },
    S: { name: "Social", color: "#2ECC71", description: "Personas empáticas, pacientes y solidarias. Disfrutan ayudar y trabajar en equipo." },
    E: { name: "Emprendedor", color: "#F39C12", description: "Personas dinámicas, extrovertidas y con orientación a resultados. Disfrutan liderar y tomar decisiones." },
    C: { name: "Convencional", color: "#1ABC9C", description: "Personas organizadas, detallistas y metódicas. Prefieren estructuras claras y procesos ordenados." }
  };

  // Calcular área principal
  const topArea = Object.entries(data.percentages).reduce((prev, [area, percentage]) => 
    percentage > prev.percentage ? { area, percentage } : prev, 
    { area: 'R', percentage: 0 }
  );

  // Ordenar áreas por porcentaje
  const sortedAreas = Object.entries(data.percentages)
    .sort(([,a], [,b]) => b - a)
    .map(([area, percentage]) => ({ ...areas[area], percentage, score: data.results[area] }));

  return `
    <div class="pdf-container">
      <!-- Header -->
      <div class="pdf-header" style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3498DB; padding-bottom: 20px;">
        <h1 style="color: #2C3E50; margin: 0; font-size: 28px;">Resultados del Test Vocacional</h1>
        <p style="color: #7F8C8D; margin: 5px 0 0 0; font-size: 16px;">Universidad Cuauhtémoc Campus Aguascalientes</p>
        <p style="color: #95A5A6; margin: 5px 0 0 0; font-size: 14px;">Fecha de generación: ${new Date().toLocaleDateString('es-MX')}</p>
      </div>

      <!-- Información del Usuario -->
      <div class="user-section" style="background: #F8F9FA; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #2C3E50; margin: 0 0 15px 0; font-size: 20px;">Información del Estudiante</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <strong>Nombre:</strong> ${data.usuario.nombre} ${data.usuario.lastname}
          </div>
          <div>
            <strong>Edad:</strong> ${data.usuario.edad} años
          </div>
          <div>
            <strong>Correo:</strong> ${data.usuario.correo}
          </div>
          <div>
            <strong>Teléfono:</strong> ${data.usuario.telefono}
          </div>
          <div style="grid-column: 1 / -1;">
            <strong>Escuela/Universidad:</strong> ${data.usuario.escuela}
          </div>
        </div>
      </div>

      <!-- Área Principal -->
      <div class="top-area-section" style="background: ${areas[topArea.area].color}; color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px; text-align: center;">
        <h2 style="margin: 0 0 15px 0; font-size: 22px;">¡Tu Área de Mayor Afinidad!</h2>
        <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 15px 25px; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 24px;">${areas[topArea.area].name}</h3>
          <p style="margin: 10px 0 0 0; font-size: 18px;">${topArea.percentage}% de afinidad</p>
        </div>
        <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">${areas[topArea.area].description}</p>
      </div>

      <!-- Resultados Detallados -->
      <div class="results-section" style="margin-bottom: 25px;">
        <h2 style="color: #2C3E50; margin: 0 0 20px 0; font-size: 20px;">Resultados por Área</h2>
        
        ${sortedAreas.map(area => `
          <div class="area-result" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; flex: 1;">
                <div style="width: 12px; height: 12px; background: ${area.color}; border-radius: 50%; margin-right: 10px;"></div>
                <span style="font-weight: bold; color: #2C3E50;">${area.name}</span>
              </div>
              <div style="text-align: right;">
                <span style="font-weight: bold; color: #2C3E50;">${area.percentage}%</span>
                <small style="color: #7F8C8D; margin-left: 10px;">(${area.score} puntos)</small>
              </div>
            </div>
            <div style="background: #ECF0F1; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background: ${area.color}; height: 100%; width: ${area.percentage}%; border-radius: 10px;"></div>
            </div>
            <p style="margin: 8px 0 0 0; color: #7F8C8D; font-size: 12px; line-height: 1.4;">${area.description}</p>
          </div>
        `).join('')}
      </div>

      <!-- Interpretación de Resultados -->
      <div class="interpretation-section" style="background: #FFF3CD; padding: 20px; border-radius: 10px; border-left: 4px solid #FFC107;">
        <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">Interpretación de tus Resultados</h3>
        <p style="color: #856404; margin: 0; line-height: 1.5; font-size: 14px;">
          Tu perfil vocacional muestra mayor afinidad con el área <strong>${areas[topArea.area].name}</strong>. 
          Esto sugiere que podrías tener éxito en carreras y profesiones relacionadas con esta área. 
          Considera explorar opciones educativas y profesionales que se alineen con tus intereses y habilidades naturales.
        </p>
      </div>

      <!-- Footer -->
      <div class="pdf-footer" style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #BDC3C7; color: #7F8C8D;">
        <p style="margin: 5px 0; font-size: 12px;">
          Test Vocacional - Universidad Cuauhtémoc Campus Aguascalientes
        </p>
        <p style="margin: 5px 0; font-size: 10px;">
          Este documento fue generado automáticamente el ${new Date().toLocaleString('es-MX')}
        </p>
      </div>
    </div>
  `;
};

// Función alternativa para generar PDF más simple (sin HTML2Canvas)
export const generateSimplePdf = (data) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Configuración inicial
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    pdf.text('Resultados del Test Vocacional', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(127, 140, 141);
    pdf.text('Universidad Cuauhtémoc Campus Aguascalientes', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Información del usuario
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    pdf.text('INFORMACIÓN DEL ESTUDIANTE:', 20, yPosition);
    
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Nombre: ${data.usuario.nombre} ${data.usuario.lastname}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Edad: ${data.usuario.edad} años`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Correo: ${data.usuario.correo}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Teléfono: ${data.usuario.telefono}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Escuela: ${data.usuario.escuela}`, 20, yPosition);
    
    yPosition += 15;

    // Área principal
    const areas = {
      R: { name: "Realista", color: [231, 76, 60] },
      I: { name: "Investigador", color: [52, 152, 219] },
      A: { name: "Artístico", color: [155, 89, 182] },
      S: { name: "Social", color: [46, 204, 113] },
      E: { name: "Emprendedor", color: [243, 156, 18] },
      C: { name: "Convencional", color: [26, 188, 156] }
    };

    const topArea = Object.entries(data.percentages).reduce((prev, [area, percentage]) => 
      percentage > prev.percentage ? { area, percentage } : prev, 
      { area: 'R', percentage: 0 }
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(...areas[topArea.area].color);
    pdf.text(`ÁREA PRINCIPAL: ${areas[topArea.area].name}`, 20, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.text(`Porcentaje de afinidad: ${topArea.percentage}%`, 20, yPosition);
    
    yPosition += 15;

    // Resultados por área
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    pdf.text('RESULTADOS POR ÁREA:', 20, yPosition);
    
    yPosition += 10;

    Object.entries(data.percentages)
      .sort(([,a], [,b]) => b - a)
      .forEach(([area, percentage]) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(44, 62, 80);
        pdf.text(`${areas[area].name}:`, 20, yPosition);
        
        pdf.setTextColor(127, 140, 141);
        pdf.text(`${percentage}% (${data.results[area]} puntos)`, 80, yPosition);
        
        // Barra simple
        const barWidth = (percentage / 100) * 80;
        pdf.setFillColor(...areas[area].color);
        pdf.rect(120, yPosition - 3, barWidth, 4, 'F');
        
        yPosition += 8;
      });

    // Footer
    yPosition += 10;
    pdf.setFontSize(8);
    pdf.setTextColor(127, 140, 141);
    pdf.text(`Documento generado el ${new Date().toLocaleString('es-MX')}`, pageWidth / 2, yPosition, { align: 'center' });

    // Guardar PDF
    const fileName = `Test_Vocacional_${data.usuario.nombre}_${data.usuario.lastname}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generando PDF simple:', error);
    alert('Error al generar el PDF: ' + error.message);
  }
};

// Exportar por defecto la función principal
export default exportResultsToPdf;