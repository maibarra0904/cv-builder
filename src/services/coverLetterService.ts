import { generateWithGemini } from './geminiService';

export type CoverLetterInputs = {
  companyName: string;
  companyUrl?: string;
  position: string;
  style?: string;
  maxWords?: number;
}

export type CVData = {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experiences?: Array<{ company?: string; role?: string; description?: string }>;
  education?: Array<{ institution?: string; degree?: string; year?: string }>;
  rawText?: string;
}

function buildPrompt(cv: CVData, inputs: CoverLetterInputs, language: string = 'es') {
  const lines: string[] = [];
  const isEn = language === 'en';
  lines.push(isEn ? `You are a professional cover letter writer in English.` : `Eres un redactor profesional de cartas de presentación en ${isEn ? 'inglés' : 'español'}.`);
  lines.push(isEn ? `Task: Generate a cover letter for ${cv.fullName || 'the candidate'} focused on the position: ${inputs.position}` : `Tarea: Genera una carta de presentación para ${cv.fullName || 'el candidato'} enfocada en el puesto: ${inputs.position}`);
  if (inputs.companyName) lines.push(`Empresa objetivo: ${inputs.companyName}`);
  if (inputs.companyUrl) lines.push(`URL de la empresa: ${inputs.companyUrl}`);
  if (inputs.style) lines.push(`Estilo solicitado: ${inputs.style}`);
  if (inputs.maxWords) lines.push(`Limita la carta a ${inputs.maxWords} palabras como máximo.`);

  lines.push('\n' + (isEn ? 'CV DATA (use strictly, do not invent information):' : 'DATOS DEL CV (usar estrictamente, no inventar información):'));
  // resumen
  if (cv.summary) lines.push(isEn ? `Professional summary: ${cv.summary}` : `Resumen profesional: ${cv.summary}`);
  // experiencias: extraer responsabilidades y logros
  if (cv.experiences && cv.experiences.length) {
    lines.push(isEn ? 'Experiences (extract responsibilities and concrete achievements; include metrics if present):' : 'Experiencias (extrae responsabilidades y logros concretos; incluye métricas si existen):');
    for (const e of cv.experiences.slice(0, 10)) {
      const role = e.role ? `${e.role}` : '';
      const company = e.company ? (isEn ? ` at ${e.company}` : ` en ${e.company}`) : '';
      const desc = e.description ? `: ${e.description}` : '';
      lines.push(`- ${role}${company}${desc}`);
    }
  }
  // educación
  if (cv.education && cv.education.length) {
    lines.push(isEn ? 'Academic background (degrees and years if available):' : 'Formación académica (títulos y años si están disponibles):');
    for (const ed of cv.education.slice(0, 5)) {
      const degree = ed.degree ? `${ed.degree}` : '';
      const inst = ed.institution ? (isEn ? ` at ${ed.institution}` : ` en ${ed.institution}`) : '';
      const year = ed.year ? ` (${ed.year})` : '';
      lines.push(`- ${degree}${inst}${year}`);
    }
  }
  // rawText fallback
  if (cv.rawText) lines.push(`Texto completo del CV: ${cv.rawText}`);

  lines.push('\n' + (isEn ? 'STRICT INSTRUCTIONS:' : 'INSTRUCCIONES ESTRICTAS:'));
  if (isEn) {
    lines.push('1) Use only the information provided in the CV data. Do not invent responsibilities, achievements, figures, companies or titles.');
    lines.push('2) Prioritize work experiences and concrete achievements: extract at least two specific examples from the CV (if present) and explain how they relate to the job requirements.');
    lines.push('3) Explicitly describe how each experience, skill and academic background aligns with the needs of the target role. Use phrases like: "My experience in X... aligns with Y because..."');
    lines.push('4) If critical information is missing to demonstrate fit for the role (e.g., metrics, duration, responsibilities), state it briefly at the end as "Missing information" and suggest 1–2 concise questions for the candidate.');
    lines.push('5) Do not add novel or invented sections (for example: projects not present in the CV).');
    lines.push('6) Use a professional, clear and direct tone; be concise and results-oriented. Avoid generic phrases and clichés.');
    lines.push('7) Structure the letter in 3-4 paragraphs: (a) opening aligning with the role/company, (b) concrete evidence extracted from the CV (experiences and skills) with 2–4 examples and metrics if any, (c) education and key skills reinforcing the fit, and (d) closing with a call to action.');
    lines.push('8) If a brief bullet format is requested for the points best demonstrating fit, include a list of up to 3 points extracted from the CV.');
    lines.push('9) The signature block must contain exactly the full name provided in the CV (`fullName`). Do not use initials, nicknames or variations. If `fullName` is missing, add at the end a separate line: "Missing information: full name".');
  } else {
    lines.push('1) Usa únicamente la información provista en los datos del CV. No inventes responsabilidades, logros, cifras, empresas ni títulos.');
    lines.push('2) Prioriza las experiencias laborales y los logros concretos: extrae al menos dos ejemplos específicos del CV (si existen) y explica cómo se relacionan con los requisitos del puesto.');
    lines.push('3) Describe explícitamente cómo cada experiencia, habilidad y la formación académica se alinean con las necesidades del puesto objetivo. Usa frases del tipo: "Mi experiencia en X... se alinea con Y porque..."');
    lines.push('4) Si falta información crítica para demostrar ajuste al puesto (por ejemplo métricas, duración, responsabilidades), indícalo brevemente al final como "Información faltante" y sugiere 1–2 preguntas concisas al candidato.');
    lines.push('5) No añadas secciones novedosas ni inventadas (por ejemplo: proyectos que no estén en el CV).');
    lines.push('6) Usa un tono profesional, claro y directo; sé conciso y orientado a resultados. Evita frases genéricas y clichés.');
    lines.push('7) Estructura la carta en 3-4 párrafos: (a) apertura con alineación al puesto/empresa, (b) evidencias concretas extraídas del CV (experiencias y habilidades) con 2–4 ejemplos y métricas si las hay, (c) formación y habilidades clave que refuercen el ajuste, y (d) cierre con llamado a la acción.');
    lines.push('8) Si se solicita un formato de lista breve para los puntos que mejor demuestran el ajuste, incluye una lista de 3 puntos máximos extraídos del CV.');
    lines.push('9) El pie de firma debe contener exactamente el nombre completo provisto en los datos del CV (`fullName`). No uses iniciales, apodos ni variaciones. Si no existe `fullName`, añade al final una línea separada: "Información faltante: nombre completo".');
  }

  if (isEn) {
    lines.push('\nExpected output: Return only the cover letter in English, without prefaces or additional explanations. Ensure the signature block matches exactly the CV `fullName`.');
  } else {
    lines.push('\nSalida esperada: Devuelve solo la carta de presentación en español, sin prefacios ni explicaciones adicionales. Asegúrate de que el pie de firma coincida exactamente con el `fullName` del CV.');
  }
  return lines.join('\n');
}

export async function generateCoverLetter(cv: CVData, inputs: CoverLetterInputs, opts?: { temperature?: number; maxOutputTokens?: number; apiKey?: string; language?: string }) {
  const prompt = buildPrompt(cv, inputs, opts?.language || 'es');
  const res = await generateWithGemini(prompt, { temperature: opts?.temperature ?? 0.2, maxOutputTokens: opts?.maxOutputTokens ?? 800, apiKey: opts?.apiKey });
  return { raw: res.raw, text: res.text || '' };
}

export default { generateCoverLetter };
