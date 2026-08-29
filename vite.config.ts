import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Un seul fichier de 574 Ko obligeait le navigateur a tout telecharger
        // et tout analyser avant la premiere interaction. On le separe en
        // trois morceaux qui se telechargent en parallele et se mettent en
        // cache separement : les bibliotheques ne changent presque jamais,
        // alors qu'une correction de texte invalidait tout le bundle.
        //
        // CE QU'ON NE PEUT PAS FAIRE ICI, et c'est important : decouper par
        // route avec React.lazy. Le pre-rendu SEO passe par `renderToString`,
        // qui ne sait pas attendre un composant paresseux — il ecrirait le
        // contenu de secours dans le HTML. On effacerait le texte que Google
        // lit sur les 26 pages pour gagner quelques kilo-octets.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['motion'],
          icones: ['lucide-react'],
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
