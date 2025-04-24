import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  experimentalModifyObstructiveThirdPartyCode: true,
  e2e: {
    baseUrl: "http://localhost:5173",
  },
});
