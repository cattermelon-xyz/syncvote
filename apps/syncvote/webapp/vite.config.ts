import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3001,
  },
  preview: {
    host: true,
    port: 8003,
  },
  // define: {
  //   // By default, Vite doesn't include shims for NodeJS/
  //   // necessary for segment analytics lib to work
  //   global: {},
  // },
});
