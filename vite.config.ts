import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 👈 Adicione esta linha

export default defineConfig({
  base: '/pokemon-app/',
  plugins: [
    tailwindcss(), // 👈 Adicione aqui
    react(),
  ],
});
