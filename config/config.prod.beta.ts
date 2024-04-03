// https://umijs.org/config/
import { defineConfig } from '@umijs/max';

export default defineConfig({
  esbuildMinifyIIFE: true,
  define: {
    API_URL: 'https://admin-api-beta.mss-boot-io.top',
  },
});
