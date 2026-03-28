import { jsPDF } from 'jspdf';
import { BuyerPersona, UserData } from '../types';

const LOGO_URL = 'https://lh3.googleusercontent.com/d/15eZccDqu3nFEKkY_n_4jfa3RrFiLDXHR';

const getBase64ImageFromURL = (url: string): Promise<string> => {
  if (url.startsWith('data:')) return Promise.resolve(url);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateStrategicPDF = async (userData: UserData, buyerPersonas: BuyerPersona[]) => {
  const doc = new jsPDF();
  const primaryColor: [number, number, number] = [19, 43, 60];
  const margin = 20;
  const contentWidth = 170;

  let logoBase64 = '';
  try { logoBase64 = await getBase64ImageFromURL(LOGO_URL); } catch (e) {}

  const addPageDecorations = () => {
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      if (logoBase64) doc.addImage(logoBase64, 'PNG', margin, 8, 25, 10);
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, 285, 190, 285);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7);
      doc.text('www.simart.com.co', margin, 290);
      doc.text(`Página ${i} de ${totalPages}`, 175, 290);
    }
  };

  const addLongText = (label: string, value: string, y: number) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(label, margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(value || 'N/A', contentWidth);
    doc.text(lines, margin, y, { align: 'justify', maxWidth: contentWidth });
    return y + (lines.length * 5) + 5;
  };

  for (const [index, persona] of buyerPersonas.entries()) {
    if (index > 0) doc.addPage();
    let yPos = 30;
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, yPos, 210, 40, 'F');
    
    // Título Justificado
    doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    const title = `BUYER PERSONA: ${persona.nombreAvatar.toUpperCase()} - ${persona.arquetipoRelacionado?.toUpperCase() || 'PERFIL'}`;
    const titleLines = doc.splitTextToSize(title, contentWidth);
    const titleY = yPos + (40 - (titleLines.length * 7)) / 2 + 5;
    doc.text(titleLines, margin, titleY);
    
    yPos += 50;

    // Foto y Arquetipo
    if (persona.imageUrl) {
      try {
        const img = await getBase64ImageFromURL(persona.imageUrl);
        doc.addImage(img, 'PNG', margin, yPos, 45, 45);
      } catch (e) {}
    }
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12); doc.text('PERFIL DEMOGRÁFICO', margin + 55, yPos + 5);
    doc.setFontSize(9); doc.setTextColor(80, 80, 80);
    doc.text(`Edad: ${persona.edad} | Ubicación: ${persona.ubicacion}`, margin + 55, yPos + 15);
    doc.text(`Ocupación: ${persona.ocupacion}`, margin + 55, yPos + 22);
    
    yPos += 55;

    // Análisis Estratégico (Recuadro Naranja)
    if (persona.aiAnalysis) {
      const descLines = doc.splitTextToSize(persona.aiAnalysis.descripcion, contentWidth);
      const stratLines = doc.splitTextToSize(persona.aiAnalysis.pilaresContenido, contentWidth);
      const toneLines = doc.splitTextToSize(persona.aiAnalysis.queEspera, contentWidth);
      const boxH = (descLines.length + stratLines.length + toneLines.length) * 5 + 45;
      
      doc.setFillColor(255, 245, 235);
      doc.roundedRect(margin - 5, yPos, contentWidth + 10, boxH, 5, 5, 'F');
      
      yPos += 10;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(13); doc.text('ANÁLISIS ESTRATÉGICO VALIDADO', margin, yPos);
      yPos += 10;
      yPos = addLongText('Descripción:', persona.aiAnalysis.descripcion, yPos);
      yPos = addLongText('Pilares Content:', persona.aiAnalysis.pilaresContenido, yPos);
      yPos = addLongText('Qué espera:', persona.aiAnalysis.queEspera, yPos);
    }
  }

  addPageDecorations();
  doc.save(`Buyer_Persona_Simart_${userData.empresa.replace(/\s+/g, '_')}.pdf`);
};
