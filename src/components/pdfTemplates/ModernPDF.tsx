// React import intentionally omitted (JSX runtime handles it)
import { Document, Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer';
import type { DocumentComponentType, PersonalData, Skill, Language } from '../../types/cv';
import { translations } from '../../i18n/translations';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 11, fontFamily: 'Helvetica' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  contact: { fontSize: 10, color: '#666' },
  section: { marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: '#1f6feb' },
  sectionRule: { height: 2, backgroundColor: '#1f6feb', width: '100%', marginTop: 2, marginBottom: 6 },
  itemTitle: { fontSize: 11, fontWeight: 'bold', color: '#111' },
  date: { fontSize: 9, fontStyle: 'italic', color: '#555' },
  small: { fontSize: 10, color: '#444' }
});

const safeFormatDate = (dateStr?: string, locale = 'es') => {
  try {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US');
  } catch (e) {
    return dateStr || '';
  }
};

export const ModernPDF: DocumentComponentType = ({ data, sectionConfig, language }) => {
  const p: Partial<PersonalData> = data.personalData ?? {};
  const getTranslation = (lang: string | undefined, path: string) => {
    const locale = lang || 'es';
    // support 'pdf.present' and map pdf.* keys to sections.* when possible
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
    // fallback: try direct traversal if a nested object exists
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
          <View>
            <Text style={styles.name}>{p.firstName} {p.lastName}</Text>
            {p.title && <Text style={styles.small}>{p.title}</Text>}
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
          {p.photo && (
            <View style={{ height: 96, borderRadius: 8, overflow: 'hidden' }}>
              <Image
                src={p.photo}
                style={{
                  height: 96,
                  objectFit: 'contain',
                  objectPosition: 'top',
                  borderRadius: 8
                }}
              />
            </View>
          )}
        </View>

        {sectionConfig.profile.visible && data.profile?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.profile')}</Text>
            <View style={styles.sectionRule} />
            <Text style={styles.small}>{data.profile.summary}</Text>
          </View>
        )}

        {sectionConfig.experience.visible && Array.isArray(data.experience) && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.experience')}</Text>
            <View style={styles.sectionRule} />
            {data.experience.map(e => (
              <View key={e.id} wrap={false} style={{ marginBottom: 4 }}>
                <Text style={styles.itemTitle}>{e.position} — {e.company}</Text>
                <Text style={styles.date}>{safeFormatDate(e.startDate, language)} — {e.current ? t('pdf.present') : safeFormatDate(e.endDate, language)}</Text>
                {e.location && <Text style={styles.small}>{e.location}</Text>}
                {e.description && <Text style={styles.small}>{e.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.education.visible && Array.isArray(data.education) && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.education')}</Text>
            <View style={styles.sectionRule} />
            {data.education.map(ed => (
              <View key={ed.id} wrap={false} style={{ marginBottom: 4 }}>
                <Text style={styles.itemTitle}>{ed.degree} — {ed.institution}</Text>
                <Text style={styles.date}>{safeFormatDate(ed.startDate, language)} — {ed.current ? t('pdf.present') : safeFormatDate(ed.endDate, language)}</Text>
                {ed.location && <Text style={styles.small}>{ed.location}</Text>}
              </View>
            ))}
          </View>
        )}

        {sectionConfig.skills.visible && Array.isArray(data.skills) && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pdf.skills')}</Text>
            <View style={styles.sectionRule} />
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {data.skills.map((s: Skill) => {
                  const lvl = Math.max(0, Math.min(5, Number(s.level || 0)));
                  const percent = Math.round((lvl / 5) * 100);
                  return (
                    <View key={s.id} style={{ marginRight: 12, marginBottom: 8 }}>
                      <Text style={styles.small}>{s.name}</Text>
                      <View style={{ width: '25%', minWidth: 120, height: 8, backgroundColor: '#000', borderRadius: 4, marginTop: 6, overflow: 'hidden' }}>
                        <View style={{ width: `${percent}%`, height: 8, backgroundColor: '#1f6feb', borderRadius: 4 }} />
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

          {sectionConfig.languages.visible && Array.isArray(data.languages) && data.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('pdf.languages')}</Text>
              <View style={styles.sectionRule} />
              {data.languages.map((l: Language, i: number) => (
                <Text key={l.id ?? i} style={styles.small}>• {l.name}{l.level ? ` (${l.level})` : ''}</Text>
              ))}
            </View>
          )}

          {sectionConfig.hobbies.visible && Array.isArray(data.hobbies) && data.hobbies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('pdf.hobbies')}</Text>
              <View style={styles.sectionRule} />
              {data.hobbies.map(h => (
                <Text key={h.id} style={styles.small}>• {h.name}{h.description ? ` — ${h.description}` : ''}</Text>
              ))}
            </View>
          )}

          {sectionConfig.projects.visible && Array.isArray(data.projects) && data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('pdf.projects')}</Text>
              <View style={styles.sectionRule} />
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
              <View style={styles.sectionRule} />
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
              <View style={styles.sectionRule} />
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
              <View style={styles.sectionRule} />
              {data.volunteers.map(v => (
                <View key={v.id} style={{ marginBottom: 4 }}>
                  <Text style={styles.itemTitle}>{v.organization} — {v.role}</Text>
                  <Text style={styles.date}>{safeFormatDate(v.startDate, language)} — {v.current ? ` — ${t('pdf.present')}` : safeFormatDate(v.endDate, language)}</Text>
                  {v.description && <Text style={styles.small}>{v.description}</Text>}
                </View>
              ))}
            </View>
          )}
      </Page>
    </Document>
  );
};

export default ModernPDF;
