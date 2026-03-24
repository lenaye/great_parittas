// Bridge between generated content and the app's data model
import parittaContent, { Stanza, ParittaContentData } from './parittaContent';

export type LanguageMode = 'myanmar' | 'english';

export interface ParittaDisplayData {
  preamble: string;
  stanzas: {
    number: number;
    pali: string;
    translation: string;
  }[];
}

/**
 * Get display-ready content for a paritta in the chosen language.
 * Matches pali stanzas with translation stanzas by their number.
 */
export function getParittaDisplayData(
  parittaId: number,
  language: LanguageMode,
  showTranslation: boolean
): ParittaDisplayData {
  const data = parittaContent[parittaId];

  if (!data) {
    return {
      preamble: '',
      stanzas: [{ number: 1, pali: 'Content not yet available.', translation: '' }],
    };
  }

  // Pick the right pali and translation arrays based on language
  const paliStanzas: Stanza[] =
    language === 'myanmar' ? data.paliMyanmar : data.paliRoman;
  const translationStanzas: Stanza[] =
    language === 'myanmar' ? data.translationMyanmar : data.translationEnglish;
  const preamble =
    language === 'myanmar' ? data.preambleMyanmar : data.preambleEnglish;

  // If no pali stanzas exist for this language, show a message
  if (paliStanzas.length === 0) {
    return {
      preamble: preamble || '',
      stanzas: [
        {
          number: 1,
          pali: language === 'myanmar'
            ? 'ပါဠိစာသား မကြာမီ ထည့်သွင်းပါမည်။'
            : 'Pali text will be added soon.',
          translation: '',
        },
      ],
    };
  }

  // Build matched stanza pairs by number
  const translationMap = new Map<number, string>();
  for (const t of translationStanzas) {
    translationMap.set(t.number, t.text);
  }

  const stanzas = paliStanzas.map((p) => ({
    number: p.number,
    pali: p.text,
    translation: showTranslation ? (translationMap.get(p.number) || '') : '',
  }));

  return { preamble: preamble || '', stanzas };
}

export default parittaContent;
