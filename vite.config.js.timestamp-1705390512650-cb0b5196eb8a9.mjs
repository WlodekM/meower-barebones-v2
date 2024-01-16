// vite.config.js
import { svelte } from "file:///C:/Users/wlodz/Projects/meower-barebones-v2/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import routify from "file:///C:/Users/wlodz/Projects/meower-barebones-v2/node_modules/@roxi/routify/lib/extra/vite-plugin/vite-plugin.js";
import { defineConfig } from "file:///C:/Users/wlodz/Projects/meower-barebones-v2/node_modules/vite/dist/node/index.js";
import { mdsvex } from "file:///C:/Users/wlodz/Projects/meower-barebones-v2/node_modules/mdsvex/dist/main.cjs.js";
import { resolve } from "path";
import postCssNesting from "file:///C:/Users/wlodz/Projects/meower-barebones-v2/node_modules/postcss-nesting/dist/index.mjs";
var production = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  clearScreen: false,
  resolve: { alias: { "@": resolve("src") } },
  plugins: [
    routify({ ssr: { disable: true, enable: false } }),
    svelte({
      compilerOptions: {
        dev: !production,
        hydratable: !!process.env.ROUTIFY_SSR_ENABLE
        //yuh uh
      },
      extensions: [".md", ".svelte"],
      preprocess: [mdsvex({ extension: "md" })]
    })
  ],
  css: { postcss: { plugins: [postCssNesting()] } },
  server: { port: 1337 }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3bG9kelxcXFxQcm9qZWN0c1xcXFxtZW93ZXItYmFyZWJvbmVzLXYyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3bG9kelxcXFxQcm9qZWN0c1xcXFxtZW93ZXItYmFyZWJvbmVzLXYyXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy93bG9kei9Qcm9qZWN0cy9tZW93ZXItYmFyZWJvbmVzLXYyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcbmltcG9ydCByb3V0aWZ5IGZyb20gJ0Byb3hpL3JvdXRpZnkvdml0ZS1wbHVnaW4nXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgbWRzdmV4IH0gZnJvbSAnbWRzdmV4J1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgcG9zdENzc05lc3RpbmcgZnJvbSAncG9zdGNzcy1uZXN0aW5nJ1xuXG5jb25zdCBwcm9kdWN0aW9uID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICByZXNvbHZlOiB7IGFsaWFzOiB7ICdAJzogcmVzb2x2ZSgnc3JjJykgfSB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcm91dGlmeSh7IHNzcjoge2Rpc2FibGU6IHRydWUsIGVuYWJsZTogZmFsc2V9IH0pLFxuICAgICAgICBzdmVsdGUoe1xuICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgZGV2OiAhcHJvZHVjdGlvbixcbiAgICAgICAgICAgICAgICBoeWRyYXRhYmxlOiAhIXByb2Nlc3MuZW52LlJPVVRJRllfU1NSX0VOQUJMRSwgIC8veXVoIHVoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXh0ZW5zaW9uczogWycubWQnLCAnLnN2ZWx0ZSddLFxuICAgICAgICAgICAgcHJlcHJvY2VzczogW21kc3ZleCh7IGV4dGVuc2lvbjogJ21kJyB9KV0sXG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgY3NzOiB7IHBvc3Rjc3M6IHsgcGx1Z2luczogW3Bvc3RDc3NOZXN0aW5nKCldIH0gfSxcblxuICAgIHNlcnZlcjogeyBwb3J0OiAxMzM3IH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VCxTQUFTLGNBQWM7QUFDcFYsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsY0FBYztBQUN2QixTQUFTLGVBQWU7QUFDeEIsT0FBTyxvQkFBb0I7QUFFM0IsSUFBTSxhQUFhLFFBQVEsSUFBSSxhQUFhO0FBRTVDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLGFBQWE7QUFBQSxFQUNiLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxRQUFRLEtBQUssRUFBRSxFQUFFO0FBQUEsRUFDMUMsU0FBUztBQUFBLElBQ0wsUUFBUSxFQUFFLEtBQUssRUFBQyxTQUFTLE1BQU0sUUFBUSxNQUFLLEVBQUUsQ0FBQztBQUFBLElBQy9DLE9BQU87QUFBQSxNQUNILGlCQUFpQjtBQUFBLFFBQ2IsS0FBSyxDQUFDO0FBQUEsUUFDTixZQUFZLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFBQTtBQUFBLE1BQzlCO0FBQUEsTUFDQSxZQUFZLENBQUMsT0FBTyxTQUFTO0FBQUEsTUFDN0IsWUFBWSxDQUFDLE9BQU8sRUFBRSxXQUFXLEtBQUssQ0FBQyxDQUFDO0FBQUEsSUFDNUMsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUU7QUFBQSxFQUVoRCxRQUFRLEVBQUUsTUFBTSxLQUFLO0FBQ3pCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
