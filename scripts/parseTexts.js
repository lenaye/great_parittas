/**
 * parseTexts.js
 *
 * Reads all Paritta text files from assets/texts/ and generates
 * a TypeScript data module at src/data/parittaContent.ts
 *
 * Usage: node scripts/parseTexts.js
 *
 * File structure expected per sutta folder:
 *   assets/texts/NN_name_sutta/
 *     pali_english.txt        - Pali text in Roman script (numbered stanzas)
 *     pali_myanmar.txt        - Pali text in Myanmar script (numbered stanzas)
 *     translation_english.txt - English translation (numbered stanzas)
 *     translation_myanmar.txt - Myanmar/Burmese translation (numbered stanzas)
 *     preamble_english.txt    - (optional) English preamble
 *     preamble_myanmar.txt    - (optional) Myanmar preamble
 *
 * Stanza format: Lines starting with "N." or "N)" where N is a number,
 * followed by the stanza text. Stanzas separated by blank lines.
 */

const fs = require('fs');
const path = require('path');

const TEXTS_DIR = path.join(__dirname, '..', 'assets', 'texts');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'parittaContent.ts');

/**
 * Parse a numbered text file into an array of stanzas.
 * Each stanza starts with a number like "1." or "၁။"
 * If no numbered stanzas are found, splits by blank lines instead.
 * Returns { preamble, stanzas } where preamble is text before first number.
 */
function parseStanzas(content) {
  if (!content || !content.trim()) return { preamble: '', stanzas: [] };

  const lines = content.split('\n');

  // First pass: check if there are any numbered stanzas
  const hasNumberedStanzas = lines.some((line) =>
    /^(\d+|[၀-၉]+)[.။)\s]/.test(line.trim())
  );

  if (hasNumberedStanzas) {
    return parseNumberedStanzas(lines);
  } else {
    return parseByBlankLines(content);
  }
}

/**
 * Parse text with numbered stanzas (e.g., "1. text...")
 */
function parseNumberedStanzas(lines) {
  const stanzas = [];
  let preambleLines = [];
  let currentNum = null;
  let currentLines = [];
  let foundFirstNumber = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Match numbered stanza start
    const match = trimmed.match(/^(\d+|[၀-၉]+)[.။)\s]/);

    if (match) {
      foundFirstNumber = true;

      // Save previous stanza if exists
      if (currentNum !== null && currentLines.length > 0) {
        stanzas.push({
          number: currentNum,
          text: currentLines.join('\n').trim(),
        });
      }

      // Extract number
      let numStr = match[1];
      const myanmarDigits = '၀၁၂၃၄၅၆၇၈၉';
      if (/[၀-၉]/.test(numStr)) {
        numStr = numStr
          .split('')
          .map((ch) => myanmarDigits.indexOf(ch))
          .join('');
      }
      currentNum = parseInt(numStr, 10);

      const textAfterNum = trimmed.replace(/^(\d+|[၀-၉]+)[.။)\s]+/, '').trim();
      currentLines = textAfterNum ? [textAfterNum] : [];
    } else if (!foundFirstNumber) {
      // Text before first numbered stanza = preamble
      if (trimmed) preambleLines.push(trimmed);
    } else if (trimmed === '' && currentNum !== null) {
      if (currentLines.length > 0) {
        currentLines.push('');
      }
    } else if (currentNum !== null) {
      currentLines.push(trimmed);
    }
  }

  // Last stanza
  if (currentNum !== null && currentLines.length > 0) {
    stanzas.push({
      number: currentNum,
      text: currentLines
        .join('\n')
        .trim()
        .replace(/\n{3,}/g, '\n\n'),
    });
  }

  return {
    preamble: preambleLines.join('\n').trim(),
    stanzas,
  };
}

/**
 * Parse text without numbered stanzas — split by blank lines.
 * Each paragraph becomes a stanza numbered sequentially.
 */
function parseByBlankLines(content) {
  const paragraphs = content
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const stanzas = paragraphs.map((text, index) => ({
    number: index + 1,
    text,
  }));

  return { preamble: '', stanzas };
}

/**
 * Read a text file safely, returning empty string if not found.
 */
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Escape string for TypeScript template literal.
 */
function escapeForTS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

function main() {
  // Find all sutta folders
  const folders = fs
    .readdirSync(TEXTS_DIR)
    .filter((f) => {
      const stat = fs.statSync(path.join(TEXTS_DIR, f));
      return stat.isDirectory();
    })
    .sort();

  console.log(`Found ${folders.length} sutta folders: ${folders.join(', ')}`);

  const allData = {};

  for (const folder of folders) {
    const folderPath = path.join(TEXTS_DIR, folder);

    // Extract sutta number from folder name (e.g., "02_ratana_sutta" -> 2)
    const numMatch = folder.match(/^(\d+)/);
    if (!numMatch) {
      console.warn(`Skipping folder with no number prefix: ${folder}`);
      continue;
    }
    const parittaId = parseInt(numMatch[1], 10);

    console.log(`\nProcessing: ${folder} (Paritta #${parittaId})`);

    // Read all files
    const paliEnglish = readFileSafe(path.join(folderPath, 'pali_english.txt'));
    const paliMyanmar = readFileSafe(path.join(folderPath, 'pali_myanmar.txt'));
    const translationEnglish = readFileSafe(
      path.join(folderPath, 'translation_english.txt')
    );
    const translationMyanmar = readFileSafe(
      path.join(folderPath, 'translation_myanmar.txt')
    );
    const preambleEnglish = readFileSafe(
      path.join(folderPath, 'preamble_english.txt')
    );
    const preambleMyanmar = readFileSafe(
      path.join(folderPath, 'preamble_myanmar.txt')
    );

    // Parse stanzas (each returns { preamble, stanzas })
    const paliEnglishParsed = parseStanzas(paliEnglish);
    const paliMyanmarParsed = parseStanzas(paliMyanmar);
    const translationEnglishParsed = parseStanzas(translationEnglish);
    const translationMyanmarParsed = parseStanzas(translationMyanmar);

    // Merge preambles: dedicated file takes priority, then inline preamble
    const finalPreambleEnglish = preambleEnglish.trim() || paliEnglishParsed.preamble || '';
    const finalPreambleMyanmar = preambleMyanmar.trim() || paliMyanmarParsed.preamble || '';

    console.log(
      `  Pali Roman: ${paliEnglishParsed.stanzas.length} stanzas`
    );
    console.log(
      `  Pali Myanmar: ${paliMyanmarParsed.stanzas.length} stanzas`
    );
    console.log(
      `  Translation English: ${translationEnglishParsed.stanzas.length} stanzas`
    );
    console.log(
      `  Translation Myanmar: ${translationMyanmarParsed.stanzas.length} stanzas`
    );
    console.log(
      `  Preamble English: ${finalPreambleEnglish ? 'Yes' : 'No'}`
    );
    console.log(
      `  Preamble Myanmar: ${finalPreambleMyanmar ? 'Yes' : 'No'}`
    );

    allData[parittaId] = {
      folderName: folder,
      paliRoman: paliEnglishParsed.stanzas,
      paliMyanmar: paliMyanmarParsed.stanzas,
      translationEnglish: translationEnglishParsed.stanzas,
      translationMyanmar: translationMyanmarParsed.stanzas,
      preambleEnglish: finalPreambleEnglish,
      preambleMyanmar: finalPreambleMyanmar,
    };
  }

  // Generate TypeScript output
  let output = `// AUTO-GENERATED by scripts/parseTexts.js
// Do not edit manually. Run: node scripts/parseTexts.js
//
// Generated: ${new Date().toISOString()}

export interface Stanza {
  number: number;
  text: string;
}

export interface ParittaContentData {
  folderName: string;
  paliRoman: Stanza[];
  paliMyanmar: Stanza[];
  translationEnglish: Stanza[];
  translationMyanmar: Stanza[];
  preambleEnglish: string;
  preambleMyanmar: string;
}

const parittaContent: Record<number, ParittaContentData> = {\n`;

  for (const [id, data] of Object.entries(allData)) {
    output += `  ${id}: {\n`;
    output += `    folderName: '${data.folderName}',\n`;

    // Write each stanza array
    for (const key of [
      'paliRoman',
      'paliMyanmar',
      'translationEnglish',
      'translationMyanmar',
    ]) {
      output += `    ${key}: [\n`;
      for (const stanza of data[key]) {
        output += `      { number: ${stanza.number}, text: \`${escapeForTS(stanza.text)}\` },\n`;
      }
      output += `    ],\n`;
    }

    // Preambles
    output += `    preambleEnglish: \`${escapeForTS(data.preambleEnglish)}\`,\n`;
    output += `    preambleMyanmar: \`${escapeForTS(data.preambleMyanmar)}\`,\n`;

    output += `  },\n`;
  }

  output += `};\n\nexport default parittaContent;\n`;

  // Write output
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
  console.log(
    `   ${Object.keys(allData).length} parittas with content written.`
  );
}

main();
