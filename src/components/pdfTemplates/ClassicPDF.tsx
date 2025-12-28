// React import intentionally omitted (JSX runtime handles it)
import { Document, Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer';
import type { DocumentComponentType, PersonalData, Skill, Language } from '../../types/cv';
import { translations } from '../../i18n/translations';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 11, fontFamily: 'Helvetica' },
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 20, fontWeight: 'bold' },
  contact: { fontSize: 10, color: '#666' },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    borderBottomStyle: 'dashed',
    paddingBottom: 2,
    alignSelf: 'flex-start'
  },
  itemTitle: { fontSize: 11, fontWeight: 'bold' },
  small: { fontSize: 10, color: '#444' },
  date: { fontSize: 9, fontStyle: 'italic', color: '#444' }
});

export const ClassicPDF: DocumentComponentType = ({ data, sectionConfig, language }) => {
  const p: Partial<PersonalData> = data.personalData ?? {};
  const getTranslation = (lang: string | undefined, path: string) => {
    const locale = lang || 'es';
    if (path === 'pdf.present') return locale === 'es' ? 'Presente' : 'Present';
    const key = path.replace(/^pdf\./, '');
    const pdfToSections: Record<string, string> = {
      profile: 'profile',
      experience: 'experience',
      education: 'education',
      skills: 'skills',
      languages: 'languages',
      hobbies: 'hobbies',
      projects: 'projects',
      courses: 'courses',
      certificates: 'certificates',
      volunteering: 'volunteers',
      volunteers: 'volunteers'
    };
    const mapped = pdfToSections[key] ?? key;
    const sectionVal = (translations as any)[locale]?.sections?.[mapped];
    if (sectionVal) return sectionVal;
    const parts = path.split('.');
    let cur: any = (translations as any)[locale];
    for (const part of parts) cur = cur?.[part];
    return cur ?? path;
  };
  const t = (pkey: string) => getTranslation(language, pkey);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {p.photo && <Image src={p.photo} style={{ width: 72, height: 72, borderRadius: 8, marginBottom: 6, objectFit: 'cover' }} />}
          <Text style={styles.name}>{p.firstName} {p.lastName}</Text>
          <Text style={styles.contact}>{p.email} • {p.phone}</Text>
          {(p.address || p.city || p.country) && (
            <Text style={styles.contact}>{[p.address, p.city, p.country].filter(Boolean).join(' • ')}</Text>
          )}
          {(p.website || p.linkedIn) && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {p.website && (
                <Link src={p.website} style={{ textDecoration: 'none' }}>
                  <Text style={styles.contact}>{String(p.website).replace(/^https?:\/\/(www\.)?/, '')}</Text>
                </Link>
              )}
              {p.website && p.linkedIn && <Text style={styles.contact}> • </Text>}
              {p.linkedIn && (
                <Link src={p.linkedIn} style={{ textDecoration: 'none' }}>
                  <Text style={styles.contact}>{String(p.linkedIn).replace(/^https?:\/\/(www\.)?/, '').replace(/^linkedin\.com\/?/, '')}</Text>
                </Link>
              )}
            </View>
          )}
        </View>

        {sectionConfig.profile.visible && data.profile?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.profile')}</Text>
            <Text style={styles.small}>{data.profile.summary}</Text>
          </View>
        )}

        {sectionConfig.experience.visible && Array.isArray(data.experience) && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.experience')}</Text>
            {data.experience.map(e => (
              <View key={e.id} wrap={false} style={{ marginBottom: 4 }}>
                <Text style={styles.itemTitle}>{e.position}</Text>
                <Text style={styles.small}>{e.company}</Text>
                <Text style={styles.date}>{e.startDate} - {e.current ? t('pdf.present') : e.endDate}</Text>
                {e.location && <Text style={styles.small}>{e.location}</Text>}
                {e.description && <Text style={styles.small}>{e.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.education.visible && Array.isArray(data.education) && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.education')}</Text>
            {data.education.map(ed => (
              <View key={ed.id} wrap={false} style={{ marginBottom: 4 }}>
                <Text style={styles.itemTitle}>{ed.degree || ed.institution}</Text>
                <Text style={styles.small}>{ed.institution}</Text>
                <Text style={styles.date}>{ed.startDate} - {ed.current ? t('pdf.present') : ed.endDate}</Text>
                {ed.location && <Text style={styles.small}>{ed.location}</Text>}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.skills.visible && Array.isArray(data.skills) && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.skills')}</Text>
            <View>
              {data.skills.map((s: Skill) => {
                const lvl = Math.max(0, Math.min(5, Number(s.level || 0)));
                const percent = Math.round((lvl / 5) * 100);
                return (
                  <View key={s.id} wrap={false} style={{ marginBottom: 6 }}>
                    <Text style={styles.small}>• {s.name}{s.level != null ? ` — ${percent}%` : ''}</Text>
                    {/* En plantilla clásica solo mostramos el porcentaje en texto */}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {sectionConfig.languages.visible && Array.isArray(data.languages) && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.languages')}</Text>
            {data.languages.map((l: Language, i: number) => (
              <Text key={l.id ?? i} style={styles.small}>• {l.name}{l.level ? ` (${l.level})` : ''}</Text>
            ))}
          </View>
        )}

        {sectionConfig.hobbies.visible && Array.isArray(data.hobbies) && data.hobbies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.hobbies')}</Text>
            {data.hobbies.map(h => (
              <Text key={h.id} style={styles.small}>• {h.name}{h.description ? ` — ${h.description}` : ''}</Text>
            ))}
          </View>
        )}

        {sectionConfig.projects.visible && Array.isArray(data.projects) && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.projects')}</Text>
            {data.projects.map(pj => (
              <View key={pj.id} style={{ marginBottom: 4 }}>
                <Text style={styles.itemTitle}>{pj.name}</Text>
                {pj.description && <Text style={styles.small}>{pj.description}</Text>}
                {pj.url && <Text style={styles.small}>{pj.url}</Text>}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.courses.visible && Array.isArray(data.courses) && data.courses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.courses')}</Text>
            {data.courses.map(c => (
              <View key={c.id} style={{ marginBottom: 4 }}>
                {c.url ? (
                  <Link src={c.url} style={{ textDecoration: 'none' }}>
                    <Text style={styles.small}>• {c.name}{c.institution ? ` — ${c.institution}` : ''}</Text>
                  </Link>
                ) : (
                  <Text style={styles.small}>• {c.name}{c.institution ? ` — ${c.institution}` : ''}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.certificates.visible && Array.isArray(data.certificates) && data.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.certificates')}</Text>
            {data.certificates.map(c => (
              <View key={c.id} style={{ marginBottom: 4 }}>
                {c.url ? (
                  <Link src={c.url} style={{ textDecoration: 'none' }}>
                    <Text style={styles.small}>• {c.name}{c.issuer ? ` — ${c.issuer}` : ''}</Text>
                  </Link>
                ) : (
                  <Text style={styles.small}>• {c.name}{c.issuer ? ` — ${c.issuer}` : ''}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.volunteers.visible && Array.isArray(data.volunteers) && data.volunteers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.volunteering')}</Text>
            {data.volunteers.map(v => (
              <View key={v.id} style={{ marginBottom: 4 }}>
                <Text style={styles.itemTitle}>{v.organization} — {v.role}</Text>
                <Text style={styles.date}>{v.startDate}{v.current ? ` — ${t('pdf.present')}` : v.endDate}</Text>
                {v.description && <Text style={styles.small}>{v.description}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ClassicPDF;
