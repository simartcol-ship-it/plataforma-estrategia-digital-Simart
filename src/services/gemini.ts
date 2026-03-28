import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  async generateBuyerPersona(sector: string, producto: string, clienteIdeal: string) {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy" });
    const prompt = `Actúa como un estratega digital experto. Genera un Buyer Persona profundo basado en:
    Sector de la empresa: ${sector}
    Producto o servicio: ${producto}
    Descripción corta del cliente: ${clienteIdeal}

    Devuelve ÚNICAMENTE un objeto JSON válido con las siguientes llaves exactas y responde en español:
    - nombreAvatar: "string"
    - edad: "string"
    - ubicacion: "string"
    - ocupacion: "string"
    - cita: "string (Insight o motivación principal)"
    - metas: "string"
    - dolores: "string"
    - valores: "string"
    - miedos: "string"
    - redesSociales: "string"
    - keywords: "string (términos de búsqueda)"
    - formatoContenido: "string"
    - competencia: "string"
    - arquetipoRelacionado: "string"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  },

  async analyzeBuyerPersonaProfile(persona: any) {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy" });
    const prompt = `Actúa como un estratega de marketing digital experto. Haz un análisis profundo de este Buyer Persona: 
    ${JSON.stringify(persona)}

    Debes devolver ÚNICAMENTE un objeto JSON válido con las siguientes llaves estructuradas:
    - descripcion: "Resumen completo de sus datos demográficos, psicográficos y comportamiento. Redacta sin usar asteriscos (**)."
    - queEspera: "Qué espera este perfil de nosotros como marca. Redacta sin usar asteriscos (**)."
    - pilaresContenido: "Define EXACTAMENTE 3 pilares de contenido de atracción. Escribe el texto en prosa fluida, sin guiones ni asteriscos (**). Separa los pilares con doble salto de línea (\\n\\n)."
    - ideasContenido: "Lista verticalmente numerada del 1 al 20 con ideas de contenido específicas. Sin asteriscos (**). IMPORTANTE: Separa de manera obligatoria cada número con un doble salto de línea (\\n\\n) para facilitar la lectura vertical."
    - analisisCompetencia: "Menciona máximo 3 nombres reales de marcas o empresas que encuentres en internet o Google que sean competidores directos para conectar con este buyer persona. Di qué hacen en contenidos de valor y cómo podemos ganarles. Redacta sin asteriscos (**)."

    REGLAS ESTRICTAS E INQUEBRANTABLES:
    - ATEMPORALIDAD ABSOLUTA: Tienes PROHIBIDO mencionar o sugerir cualquier año específico (ej. 2023, 2024, 2025, etc.) en los títulos, copies o estrategias. Todo debe ser diseñado para ser válido en cualquier fecha (Ej: en lugar de "Aumenta ventas en 2024", solo escribe "Aumenta ventas").
    - Está PROHIBIDO usar asteriscos (**) en cualquier parte de tu respuesta. Usa texto plano limpio siempre.
    - Toda la respuesta debe estar en español, ser accionable y profunda.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  },

  async generateBuyerPersonaImage(personaInfo: any): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy" });
    
    // Necesitamos edad y género exactos para forzar la IA visual
    let age = 35;
    let gender = 'man';
    
    try {
      const textPrompt = `Analiza este perfil: Edad "${personaInfo.edad}", Nombre/Ocupación "${personaInfo.nombreAvatar} ${personaInfo.ocupacion}".
      Responde ÚNICAMENTE con un objeto JSON (sin markdown, solo las llaves) con dos propiedades:
      "age": un número entero aproximado basado en el rango de edad sugerido.
      "gender": estrictamente la palabra "man" o "woman".
      Ejemplo: {"age": 45, "gender": "man"}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt,
      });
      
      const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const data = JSON.parse(text);
      if (data.age) age = data.age;
      if (data.gender) gender = data.gender;
    } catch {
      // Si falla, valores por defecto
    }

    const visualPrompt = `A hyper-realistic highly detailed frontal portrait photograph of a ${age} year old ${gender} professional. Studio lighting, solid neutral background, 8k resolution.`;
    
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-001',
        prompt: visualPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg'
        }
      });
      const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
      if (!imageBytes) throw new Error("No image generated");
      return `data:image/jpeg;base64,${imageBytes}`;
    } catch (e) {
      console.error("Error generating image with Imagen 3:", e);
      throw e;
    }
  }
};
