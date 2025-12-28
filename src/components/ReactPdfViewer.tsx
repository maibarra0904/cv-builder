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

  const { t, currentLanguage } = useTranslation();

  // key used to force remount PDFViewer when reload is requested
  const [previewKey, setPreviewKey] = useState(0);

  class PdfErrorBoundary extends React.Component<{
    onReload: () => void;
    children?: React.ReactNode;
  }, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch(error: unknown) {
      console.warn('PdfErrorBoundary caught error', error);
    }
    render() {
      if (this.state.hasError) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => { this.setState({ hasError: false }); this.props.onReload(); }}
              title={t('messages.reloadPreview', 'Reload preview')}
              aria-label={t('messages.reloadPreview', 'Reload preview')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a8 8 0 111.707 5.293l-.853-.854A6 6 0 1010 4V1l4 4-4 4V6a8 8 0 01-6-2z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">{t('messages.reloadPreview', 'Reload preview')}</span>
            </button>
          </div>
        );
      }
      return this.props.children as React.ReactElement;
    }
  }

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
          <PdfErrorBoundary onReload={() => setPreviewKey(k => k + 1)}>
            <div key={previewKey} style={{ width: '100%', height: '100%' }}>
              <PDFViewer style={{ width: '100%', height: '100%' }}>
                {DocumentComponent}
              </PDFViewer>
            </div>
          </PdfErrorBoundary>
        ) : (
          <div style={{ width: '100%', height: '100%' }} className="flex items-center justify-center text-gray-600">{t('messages.generating', 'Generando documento...')}</div>
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
