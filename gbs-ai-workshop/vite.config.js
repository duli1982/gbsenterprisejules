import { defineConfig } from 'vite';

export default defineConfig({
  // The root directory of the project is where index.html is located.
  // Since we are running vite from the 'gbs-ai-workshop' directory, the root is the current directory.
  root: '.',
  build: {
    // The output directory for the build.
    outDir: 'dist',
  },
  server: {
    // The port for the dev server.
    port: 3000,
  },
});
