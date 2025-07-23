import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react-swc"
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // 운영 환경 빌드 최적화 (esbuild 사용)
      minify: 'esbuild',
      // 소스맵 생성 (운영 환경에서는 비활성화)
      sourcemap: !isProduction,
    },
    // 개발 서버 설정
    server: {
      port: 8080,
      strictPort: true,
    },
    // 환경별 설정
    define: {
      __IS_PRODUCTION__: JSON.stringify(isProduction),
      __IS_DEVELOPMENT__: JSON.stringify(!isProduction),
    },
  };
});
