import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import ModernPDF from './pdfTemplates/ModernPDF';
import ClassicPDF from './pdfTemplates/ClassicPDF';
import { useCV } from '../hooks/useCV';
import type { CVTemplate, DocumentElement, CVData, SectionConfig } from '../types/cv';
import useTranslation from '../i18n/useTranslation2';

export const ReactPdfViewer: React.FC<{ embedded?: boolean }> = ({ embedded = true }) => {
  const { state } = useCV();
  const data = state.cvData;
  const template: CVTemplate = state.currentTemplate || 'modern';
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  // debounce updates to avoid rapid re-renders that can crash react-pdf reconciler
  const [debouncedData, setDebouncedData] = useState<{ data: CVData; sectionConfig: SectionConfig }>({ data, sectionConfig: state.sectionConfig });
  const debounceTimer = useRef<number | null>(null);

  const { currentLanguage } = useTranslation();

  const DocumentComponent = useMemo<DocumentElement | null>(() => {
    const targetData = debouncedData.data;
    const targetConfig = debouncedData.sectionConfig;
    switch (template) {
      case 'classic': return <ClassicPDF data={targetData} sectionConfig={targetConfig} language={currentLanguage} />;
      default: return <ModernPDF data={targetData} sectionConfig={targetConfig} language={currentLanguage} />;
    }
  }, [template, debouncedData]);

  useEffect(() => {
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    // small delay to batch rapid updates
    debounceTimer.current = window.setTimeout(() => {
      setDebouncedData({ data, sectionConfig: state.sectionConfig });
      debounceTimer.current = null;
    }, 250);
    return () => { if (debounceTimer.current) window.clearTimeout(debounceTimer.current); };
  }, [data, state.sectionConfig]);

  useEffect(() => {
    // generate blob for download/print
    let cancelled = false;
    (async () => {
      try {
        // Create a fresh element instance for pdf generation to avoid sharing the
        // same element instance that is mounted by PDFViewer (this can trigger
        // reconciler issues in react-pdf).
        if (!DocumentComponent || !React.isValidElement(DocumentComponent)) return;
        // Treat the mounted document element permissively here to avoid
        // a type collision between our local `DocumentProps` and the
        // `DocumentProps` type exported by @react-pdf/renderer.
        const docElement = DocumentComponent as React.ReactElement<unknown>;
        const Comp = docElement.type as React.ComponentType<any>;
        const props = (docElement.props ?? {}) as unknown;
        const element = React.createElement(Comp, props) as React.ReactElement<any>;
        const asPdf = pdf(element);
        const blob = await asPdf.toBlob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setBlobUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
      } catch (e) {
        console.warn('ReactPdfViewer: error generating blob (ignored)', e);
      }
    })();
    return () => { cancelled = true; };
  }, [DocumentComponent]);

  if (!embedded) return null;

  return (
    <div className="w-full h-full">
      <div style={{ height: '100%', width: '100%' }}>
        {DocumentComponent ? (
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            {DocumentComponent}
          </PDFViewer>
        ) : (
          <div style={{ width: '100%', height: '100%' }} className="flex items-center justify-center text-gray-600">Generando documento...</div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        {blobUrl && (
          <>
            <a href={blobUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-100 rounded">Abrir en pestaña</a>
            <button onClick={() => { const w = window.open(blobUrl); if (w) w.print(); }} className="px-3 py-1 bg-gray-100 rounded">Imprimir</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReactPdfViewer;
