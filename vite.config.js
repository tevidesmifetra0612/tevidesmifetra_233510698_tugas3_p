import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { fileURLToPath, URL } from 'node:url'; // Digunakan untuk alias path

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  plugins: [

    vue({

      template: { transformAssetUrls }
    }),

    quasar({

      sassVariables: 'src/quasar-variables.sass',
      autoImport: true,
    })
  ]
});