import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        signup: './signup.html',
        planche: './pages/planche.html',
        frontLever: './pages/front-lever.html',
        handstandPushups: './pages/handstand-pushups.html',
        muscleUps: './pages/muscle-ups.html',
      },
    },
  },
});
