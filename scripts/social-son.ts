/**
 * social-son.ts — Fabrique la musique d'un carrousel, note par note.
 *
 * POURQUOI ON NE PREND PAS UNE CHANSON À LA MODE
 *
 * L'API de Meta n'ouvre sa bibliothèque musicale que pour les Reels, et coller
 * une vraie chanson dans une diapo fait couper le son ou retirer la publication.
 * Ici tout est calculé : aucun échantillon, aucune licence, aucun droit à payer.
 *
 * Quatre morceaux tournent d'une semaine à l'autre. Un fichier audio déposé
 * dans `public/social/sons/` (mp3, m4a, wav) passe avant eux.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MES_SONS = path.resolve(__dirname, '..', 'public', 'social', 'sons');

const FE = 48000;

interface Morceau {
  nom: string;
  bpm: number;
  /** La tonique de chaque accord, en numéro MIDI (grave). Une mesure chacun. */
  basses: number[];
  /** Les notes de l'accord au-dessus, en MIDI. */
  accords: number[][];
  /** Seize cases par mesure. x = coup. */
  grosse: string;
  caisse: string;
  charleston: string;
  basse: string;
  /** Retard des doubles-croches faibles, en fraction de case. */
  balance: number;
}

// Quatre progressions mineures très courantes, en boucle de quatre mesures.
const MORCEAUX: Morceau[] = [
  {
    nom: 'chantier',
    bpm: 100,
    basses: [33, 29, 36, 31],
    accords: [[57, 60, 64, 67], [57, 60, 65, 69], [55, 60, 64, 67], [55, 59, 62, 67]],
    grosse: 'x.....x...x.....',
    caisse: '....x.......x...',
    charleston: 'x.x.x.x.x.x.x.xx',
    basse: 'x.....x...x...x.',
    balance: 0.16,
  },
  {
    nom: 'matin',
    bpm: 92,
    basses: [38, 34, 29, 36],
    accords: [[57, 60, 62, 65], [58, 62, 65, 69], [57, 60, 65, 69], [55, 60, 64, 67]],
    grosse: 'x..x......x.....',
    caisse: '....x.......x..x',
    charleston: 'x.xxx.x.x.xxx.x.',
    basse: 'x..x......x.x...',
    balance: 0.22,
  },
  {
    nom: 'cadence',
    bpm: 112,
    basses: [28, 36, 31, 38],
    accords: [[55, 59, 64, 67], [55, 60, 64, 67], [55, 59, 62, 67], [57, 62, 66, 69]],
    grosse: 'x...x...x...x...',
    caisse: '....x.......x...',
    charleston: '..x...x...x...x.',
    basse: '..x...x...x...x.',
    balance: 0,
  },
  {
    nom: 'nuit',
    bpm: 104,
    basses: [36, 32, 27, 34],
    accords: [[58, 60, 63, 67], [56, 60, 63, 68], [55, 58, 63, 67], [58, 62, 65, 70]],
    grosse: 'x.....x.x.......',
    caisse: '....x.......x...',
    charleston: 'xxx.xxx.xxx.xxxx',
    basse: 'x.....x.x...x...',
    balance: 0.1,
  },
];

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Le morceau de la semaine. Le rang fait tourner les quatre. */
export function morceauDuRang(rang: number) {
  return MORCEAUX[((rang % MORCEAUX.length) + MORCEAUX.length) % MORCEAUX.length];
}

/** Un son déposé à la main, s'il y en a. */
export function sonDepose(rang: number): string | null {
  if (!fs.existsSync(MES_SONS)) return null;
  const f = fs.readdirSync(MES_SONS).filter((n) => /\.(mp3|m4a|wav)$/i.test(n)).sort();
  return f.length ? path.join(MES_SONS, f[rang % f.length]) : null;
}

/**
 * Écrit le morceau dans un WAV.
 *
 * `coupes` : des instants, en secondes, où un souffle monte et un coup grave tombe.
 */
export function fabriquerSon(fichier: string, rang: number, duree: number, coupes: number[]): void {
  const m = morceauDuRang(rang);
  const n = Math.ceil(duree * FE);
  const G = new Float32Array(n);
  const D = new Float32Array(n);
  // La réverbération : on envoie une part de chaque son dans ce tampon.
  const envoi = new Float32Array(n);
  // Le « pompage » : accords et basse se retirent quand la grosse caisse tape.
  const creux = new Float32Array(n).fill(1);

  // Hasard fixe : le même rang rend exactement le même fichier.
  let graine = 1234567 + rang;
  const hasard = () => {
    graine = (graine * 1664525 + 1013904223) >>> 0;
    return (graine / 4294967296) * 2 - 1;
  };
  const ajouter = (i: number, g: number, d: number, rev = 0) => {
    if (i < 0 || i >= n) return;
    G[i] += g;
    D[i] += d;
    envoi[i] += (g + d) * 0.5 * rev;
  };

  const caseS = 60 / m.bpm / 4;
  const mesureS = caseS * 16;
  const mesures = Math.ceil(duree / mesureS);
  const instant = (mes: number, c: number) => mes * mesureS + (c + (c % 2 ? m.balance : 0)) * caseS;

  const grosse = (t: number) => {
    const d0 = Math.floor(t * FE);
    let ph = 0;
    for (let k = 0; k < 0.34 * FE; k++) {
      const s = k / FE;
      ph += (2 * Math.PI * (46 + 110 * Math.exp(-s * 38))) / FE;
      const v = (Math.sin(ph) * Math.exp(-s * 9) + hasard() * 0.25 * Math.exp(-s * 420)) * 0.82;
      ajouter(d0 + k, v, v);
    }
    for (let k = 0; k < 0.2 * FE; k++) {
      if (d0 + k < n) creux[d0 + k] = Math.min(creux[d0 + k], 0.42 + 0.58 * (k / (0.2 * FE)));
    }
  };
  const caisse = (t: number, force: number) => {
    const d0 = Math.floor(t * FE);
    let bas = 0;
    for (let k = 0; k < 0.22 * FE; k++) {
      const s = k / FE;
      const b = hasard();
      bas += (b - bas) * 0.22;
      const v = ((b - bas) * 0.42 * Math.exp(-s * 19) + Math.sin(2 * Math.PI * 188 * s) * 0.3 * Math.exp(-s * 26)) * force;
      ajouter(d0 + k, v, v, 0.35);
    }
  };
  const charleston = (t: number, force: number, cote: number) => {
    const d0 = Math.floor(t * FE);
    let prec = 0;
    for (let k = 0; k < 0.05 * FE; k++) {
      const b = hasard();
      const v = (b - prec) * 0.11 * Math.exp((-k / FE) * 85) * force;
      prec = b;
      ajouter(d0 + k, v * (1 - cote), v * (1 + cote));
    }
  };
  const basse = (t: number, midi: number, long: number) => {
    const d0 = Math.floor(t * FE);
    const f = freq(midi);
    for (let k = 0; k < long * FE; k++) {
      const i = d0 + k;
      if (i >= n) break;
      const s = k / FE;
      const env = Math.min(1, s / 0.008) * Math.min(1, (long - s) / 0.04) * (0.55 + 0.45 * Math.exp(-s * 5));
      // Les harmoniques comptent : un haut-parleur de cellulaire n'entend pas 50 Hz.
      const v = Math.tanh(1.6 * Math.sin(2 * Math.PI * f * s) + 0.55 * Math.sin(4 * Math.PI * f * s) + 0.25 * Math.sin(6 * Math.PI * f * s));
      ajouter(i, v * env * 0.3 * creux[i], v * env * 0.3 * creux[i]);
    }
  };
  /** Un piano électrique : deux oscillateurs, le second module le premier. */
  const touche = (t: number, midi: number, long: number, force: number, cote: number) => {
    const d0 = Math.floor(t * FE);
    const f = freq(midi);
    for (let k = 0; k < long * FE; k++) {
      const i = d0 + k;
      if (i >= n) break;
      const s = k / FE;
      const env = Math.min(1, s / 0.004) * Math.exp(-s * 2.1) * Math.min(1, (long - s) / 0.06);
      const mod = Math.sin(2 * Math.PI * f * 2.001 * s) * 1.5 * Math.exp(-s * 6);
      const v = Math.sin(2 * Math.PI * f * s + mod) * env * force * creux[i];
      const trem = 1 + 0.12 * Math.sin(2 * Math.PI * 4.6 * s);
      ajouter(i, v * (1 - cote) * trem, v * (1 + cote) * (2 - trem), 0.5);
    }
  };

  // Les grosses caisses d'abord : elles creusent la place des autres.
  for (let mes = 0; mes < mesures; mes++) {
    for (let c = 0; c < 16; c++) if (m.grosse[c] === 'x') grosse(instant(mes, c));
  }
  for (let mes = 0; mes < mesures; mes++) {
    const a = mes % 4;
    for (let c = 0; c < 16; c++) {
      const t = instant(mes, c);
      if (m.caisse[c] === 'x') caisse(t, c % 4 === 0 ? 1 : 0.4);
      if (m.charleston[c] === 'x') charleston(t, c % 4 === 2 ? 1 : 0.6, c % 8 === 0 ? -0.25 : 0.25);
      if (m.basse[c] === 'x') {
        const suite = (m.basse + 'x').indexOf('x', c + 1) - c;
        basse(t, m.basses[a], Math.max(1, Math.min(suite, 6)) * caseS * 0.92);
      }
    }
    // L'accord : plaqué au début, repris à contretemps.
    m.accords[a].forEach((note, k) => {
      const cote = (k - 1.5) * 0.2;
      touche(instant(mes, 0) + k * 0.012, note, mesureS * 0.62, 0.15, cote);
      touche(instant(mes, 10) + k * 0.008, note, mesureS * 0.34, 0.11, cote);
    });
    // Une petite mélodie au-dessus, une mesure sur deux.
    if (mes % 2 === 1) {
      [[3, 2], [6, 3], [9, 1], [12, 2]].forEach(([c, k]) => touche(instant(mes, c), m.accords[a][k] + 12, 0.5, 0.09, 0.3));
    }
  }

  // Le souffle et le coup, sur chaque changement de diapo.
  for (const t of coupes) {
    const long = 0.42;
    let bas = 0;
    for (let k = 0; k < long * FE; k++) {
      const p = k / (long * FE);
      bas += (hasard() - bas) * (0.05 + 0.4 * p);
      const v = bas * p * p * 0.34;
      ajouter(Math.floor((t - long) * FE) + k, v * (1.2 - p * 0.4), v * (0.8 + p * 0.4), 0.4);
    }
    let ph = 0;
    for (let k = 0; k < 0.6 * FE; k++) {
      const s = k / FE;
      ph += (2 * Math.PI * (38 + 50 * Math.exp(-s * 12))) / FE;
      const v = Math.sin(ph) * Math.exp(-s * 5.5) * 0.42;
      ajouter(Math.floor(t * FE) + k, v, v, 0.3);
    }
  }

  // La pièce : quatre échos filtrés par côté.
  const echo = (retards: number[], sortie: Float32Array) => {
    for (const r of retards) {
      const pas = Math.floor(r * FE);
      const ligne = new Float32Array(pas);
      let p = 0;
      let doux = 0;
      for (let i = 0; i < n; i++) {
        const s = ligne[p];
        doux += (s - doux) * 0.42;
        ligne[p] = envoi[i] + doux * 0.72;
        sortie[i] += s * 0.1;
        p = (p + 1) % pas;
      }
    }
  };
  echo([0.0297, 0.0371, 0.0411, 0.0437], G);
  echo([0.0311, 0.0359, 0.0423, 0.0451], D);

  // Dernier tour : saturation douce, entrée franche, sortie en fondu.
  const pcm = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const fin = Math.min(1, (n - i) / (0.5 * FE)) * Math.min(1, i / 96);
    pcm.writeInt16LE(Math.round(Math.tanh(G[i] * 0.95) * 30000 * fin), i * 4);
    pcm.writeInt16LE(Math.round(Math.tanh(D[i] * 0.95) * 30000 * fin), i * 4 + 2);
  }
  const tete = Buffer.alloc(44);
  tete.write('RIFF', 0);
  tete.writeUInt32LE(36 + pcm.length, 4);
  tete.write('WAVEfmt ', 8);
  tete.writeUInt32LE(16, 16);
  tete.writeUInt16LE(1, 20);
  tete.writeUInt16LE(2, 22);
  tete.writeUInt32LE(FE, 24);
  tete.writeUInt32LE(FE * 4, 28);
  tete.writeUInt16LE(4, 32);
  tete.writeUInt16LE(16, 34);
  tete.write('data', 36);
  tete.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(fichier, Buffer.concat([tete, pcm]));
}
