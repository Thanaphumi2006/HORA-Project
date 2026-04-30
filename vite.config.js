import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/HORA-Project/',
  server: { port: 8080, open: true },
});
