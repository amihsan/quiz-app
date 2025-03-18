import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "build", // Specifies the directory where the production build will be placed
  },
  plugins: [react()], // React plugin for JSX support, Fast Refresh, and React optimizations
  server: {
    port: 3000, // Optional: Set the port for the development server (default is 3000)
  },
});
