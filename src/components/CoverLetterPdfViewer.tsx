import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useCV } from '../hooks/useCV';

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: '#0f172a'
  },
  header: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  nameBlock: { flexDirection: 'column' },
  name: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  contact: { fontSize: 9, color: '#555555' },
  date: { fontSize: 10, color: '#222222' },
  recipient: { marginTop: 6, marginBottom: 8, fontSize: 11, fontWeight: 600 },
  subject: { marginBottom: 8, fontSize: 11, fontWeight: 600, color: '#0b5cff' },
  body: { fontSize: 11, lineHeight: 1.5, color: '#111827' },
  paragraph: { marginBottom: 8 },
  closing: { marginTop: 12, marginBottom: 24 },
  signatureName: { fontSize: 12, fontWeight: 700 },
  footerNote: { fontSize: 8, color: '#6b7280', marginTop: 18 }
});

const splitToParagraphs = (text: string) => {
  if (!text) return [''];
  return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
}

const CoverLetterPdfViewer: React.FC<{ text: string }> = ({ text }) => {
  const { state } = useCV();
  const pd = state.cvData?.personalData || { firstName: '', lastName: '', email: '', phone: '', website: '', location: '' };
  const fullName = `${(pd.firstName || '').trim()} ${(pd.lastName || '').trim()}`.trim();
  // Render the editable body exactly as provided to avoid parsing errors when users edit the last lines.
  let bodyText = (text || '').replace(/\r/g, '').trim();

  // Strip common closing words and any trailing occurrence of the candidate name to avoid duplication
  const closingRegex = /(\n\s*(Sincerely,|Regards,|Best regards,|Atentamente,|Saludos,|Cordiales saludos,|Sincerely|Regards|Best)\s*)$/i;
  bodyText = bodyText.replace(closingRegex, '').trim();

  if (fullName) {
    const escapedName = fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(`(\n\s*)${escapedName}(\s*)$`);
    bodyText = bodyText.replace(nameRegex, '').trim();
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString();

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.leftAccent} />
            <View style={styles.header}>
              <View style={styles.nameBlock}>
                <Text style={styles.name}>{fullName || ''}</Text>
                <Text style={styles.contact}>{pd.email || ''}{pd.phone ? ` · ${pd.phone}` : ''}</Text>
                {pd.website ? <Text style={styles.contact}>{pd.website}</Text> : null}
              </View>
              <View>
                <Text style={styles.date}>{dateStr}</Text>
              </View>
            </View>

            <View style={styles.body}>
              {/* Render the whole editable body as-is to prevent slicing/parsing issues */}
              <Text style={styles.paragraph}>{bodyText}</Text>
            </View>

            
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default CoverLetterPdfViewer;
