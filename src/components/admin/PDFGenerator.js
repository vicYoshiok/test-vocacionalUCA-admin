// src/components/admin/PDFGenerator.js
import React from 'react';
// ✅ CORRECTO - usa ruta relativa
import { exportResultsToPdf, generateSimplePdf } from '../../utils/exportPdf';

const PDFGenerator = ({ result }) => {
  const handleGenerateIndividualPDF = () => {
    const pdfData = {
      usuario: {
        nombre: result.nombre,
        lastname: result.apellido,
        correo: result.correo,
        telefono: result.telefono,
        edad: result.edad,
        escuela: result.escuela
      },
      results: {
        R: result.puntaje_R,
        I: result.puntaje_I,
        A: result.puntaje_A,
        S: result.puntaje_S,
        E: result.puntaje_E,
        C: result.puntaje_C
      },
      percentages: {
        R: result.porcentaje_R,
        I: result.porcentaje_I,
        A: result.porcentaje_A,
        S: result.porcentaje_S,
        E: result.porcentaje_E,
        C: result.porcentaje_C
      },
      respuestas: result.respuestas || {},
      fecha: result.created_at
    };

    // Usar la función simple para mejor compatibilidad
    generateSimplePdf(pdfData);
  };

  const handleGenerateDetailedPDF = () => {
    const pdfData = {
      usuario: {
        nombre: result.nombre,
        lastname: result.apellido,
        correo: result.correo,
        telefono: result.telefono,
        edad: result.edad,
        escuela: result.escuela
      },
      results: {
        R: result.puntaje_R,
        I: result.puntaje_I,
        A: result.puntaje_A,
        S: result.puntaje_S,
        E: result.puntaje_E,
        C: result.puntaje_C
      },
      percentages: {
        R: result.porcentaje_R,
        I: result.porcentaje_I,
        A: result.porcentaje_A,
        S: result.porcentaje_S,
        E: result.porcentaje_E,
        C: result.porcentaje_C
      },
      respuestas: result.respuestas || {},
      fecha: result.created_at
    };

    // Usar la función con diseño HTML (más atractivo)
    exportResultsToPdf(pdfData);
  };

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          <i className="bi bi-file-earmark-pdf me-2"></i>
          Generar Reportes PDF
        </h5>
      </div>
      
      <div className="card-body">
        <div className="d-grid gap-2">
          <button 
            className="btn btn-danger"
            onClick={handleGenerateIndividualPDF}
          >
            <i className="bi bi-file-pdf me-2"></i>
            PDF Simple (Rápido)
          </button>
          
          <button 
            className="btn btn-outline-danger"
            onClick={handleGenerateDetailedPDF}
          >
            <i className="bi bi-file-earmark-pdf me-2"></i>
            PDF Detallado (Con Diseño)
          </button>
        </div>

        {/* Información del reporte */}
        <div className="mt-3 p-3 bg-light rounded">
          <h6 className="mb-2">Características del PDF:</h6>
          <ul className="small mb-0">
            <li>Datos personales del usuario</li>
            <li>Resultados completos por área</li>
            <li>Gráficas de porcentajes</li>
            <li>Área de mayor afinidad destacada</li>
            <li>Interpretación de resultados</li>
            <li>Fecha de realización del test</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;