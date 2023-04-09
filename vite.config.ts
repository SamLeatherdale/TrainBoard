import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        visualizer({
            filename: "reports/stats.html",
        }),
    ],
    server: {
        port: 3000,
    },
});
