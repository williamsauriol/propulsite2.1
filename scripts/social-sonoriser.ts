/**
 * social-sonoriser.ts — Donne un son à chaque image du carrousel.
 *
 * POURQUOI
 *
 * L'API d'Instagram n'accepte aucune chanson sur un carrousel, mais elle accepte
 * des diapos vidéo. On enferme donc chaque image fixe avec une boucle de
 * musique. À l'écran, rien ne bouge : c'est un vrai carrousel, qu'on glisse
 * avec le doigt, et il joue de la musique.
 *
 * La boucle fait exactement quatre mesures, prises au milieu du morceau : elle
 * recommence sans trou quand on reste longtemps sur la même diapo.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fabriquerSon, morceauDuRang, sonDepose } from './social-son';

/** Rend les noms des mp4, dans l'ordre. Lève une erreur si ffmpeg manque. */
export function sonoriser(dossier: string, images: string[], rang: number): string[] {
  const ffmpeg = process.env.FFMPEG || 'ffmpeg';
  if (spawnSync(ffmpeg, ['-version'], { stdio: 'ignore' }).status !== 0) {
    throw new Error('ffmpeg introuvable : installe-le, ou donne son chemin dans FFMPEG.');
  }
  const m = morceauDuRang(rang);
  const boucle = (60 / m.bpm) * 16;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'son-'));
  try {
    const depose = sonDepose(rang);
    const wav = path.join(tmp, 'son.wav');
    // Deux boucles, et on garde la deuxieme : elle porte la queue de l'echo de
    // la premiere, donc la reprise ne s'entend pas.
    if (!depose) fabriquerSon(wav, rang, boucle * 2 + 1, []);
    console.log(`  Son : ${depose ? path.basename(depose) : `« ${m.nom} », ${m.bpm} bpm`}`);

    return images.map((nom) => {
      const sortie = nom.replace(/\.png$/, '.mp4');
      const r = spawnSync(ffmpeg, [
        '-y', '-loglevel', 'error',
        '-loop', '1', '-framerate', '30', '-i', path.join(dossier, nom),
        '-ss', depose ? '0' : boucle.toFixed(4), '-t', boucle.toFixed(4), '-i', depose || wav,
        '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'medium', '-tune', 'stillimage', '-crf', '17',
        '-profile:v', 'high', '-g', '60', '-bf', '0', '-flags', '+cgop',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
        // -14 LUFS : le volume auquel les plateformes ramènent tout.
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9',
        '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2',
        '-t', boucle.toFixed(4),
        // Instagram refuse les listes d'édition et veut l'index au début.
        '-use_editlist', '0', '-movflags', '+faststart', path.join(dossier, sortie),
      ]);
      if (r.status !== 0) throw new Error(`ffmpeg sur ${nom} : ${String(r.stderr).slice(0, 300)}`);
      return sortie;
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
