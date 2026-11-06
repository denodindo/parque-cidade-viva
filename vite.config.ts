/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o mesmo build abre no app desktop (file://) e em qualquer subpasta de site.
  base: './',
  build: {
    rolldownOptions: {
      output: {
        // Separa o motor 3D (só baixado quando a cena carrega) do código da maquete.
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            { name: 'three-core', test: /node_modules[\\/]three[\\/]/ },
            { name: 'r3f-drei', test: /node_modules[\\/](@react-three|three-stdlib|troika|@monogrid|camera-controls|maath|meshline|stats)/ },
          ],
        },
      },
    },
    // O núcleo do Three.js sozinho tem ~700 kB minificado e só é carregado sob demanda (React.lazy).
    chunkSizeWarningLimit: 800,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
