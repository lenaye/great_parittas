// Data definitions for the 11 Great Parittas
// Text content will be loaded from separate text files placed in assets/texts/

export interface ParittaStanza {
  pali: string;
  translation: string;
}

export interface ParittaContent {
  stanzas: ParittaStanza[];
}

export interface ParittaInfo {
  id: number;
  titlePali: string;
  titleMyanmar: string;
  titleEnglish: string;
}

export const PARITTAS: ParittaInfo[] = [
  {
    id: 1,
    titlePali: 'Maṅgala Sutta',
    titleMyanmar: 'မင်္ဂလသုတ်',
    titleEnglish: 'Discourse on Blessings',
  },
  {
    id: 2,
    titlePali: 'Ratana Sutta',
    titleMyanmar: 'ရတနသုတ်',
    titleEnglish: 'Discourse on Jewels',
  },
  {
    id: 3,
    titlePali: 'Metta Sutta',
    titleMyanmar: 'မေတ္တသုတ်',
    titleEnglish: 'Discourse on Loving-Kindness',
  },
  {
    id: 4,
    titlePali: 'Khandha Paritta',
    titleMyanmar: 'ခန္ဓပရိတ်',
    titleEnglish: 'Aggregate Protection',
  },
  {
    id: 5,
    titlePali: 'Mora Paritta',
    titleMyanmar: 'မောရပရိတ်',
    titleEnglish: 'Peacock Protection',
  },
  {
    id: 6,
    titlePali: 'Vaṭṭaka Paritta',
    titleMyanmar: 'ဝဋ္ဋကပရိတ်',
    titleEnglish: 'Quail Protection',
  },
  {
    id: 7,
    titlePali: 'Dhajagga Sutta',
    titleMyanmar: 'ဓဇဂ္ဂသုတ်',
    titleEnglish: 'Discourse on the Crest of the Banner',
  },
  {
    id: 8,
    titlePali: 'Āṭānāṭiya Sutta',
    titleMyanmar: 'အာဋာနာဋိယသုတ်',
    titleEnglish: 'Āṭānāṭiya Discourse',
  },
  {
    id: 9,
    titlePali: 'Aṅgulimāla Paritta',
    titleMyanmar: 'အင်္ဂုလိမာလပရိတ်',
    titleEnglish: 'Aṅgulimāla Protection',
  },
  {
    id: 10,
    titlePali: 'Bojjhaṅga Sutta',
    titleMyanmar: 'ဗောဇ္ဈင်္ဂသုတ်',
    titleEnglish: 'Discourse on Factors of Enlightenment',
  },
  {
    id: 11,
    titlePali: 'Pubbaṇha Sutta',
    titleMyanmar: 'ပုဗ္ဗဏှသုတ်',
    titleEnglish: 'Discourse on the Morning',
  },
];
