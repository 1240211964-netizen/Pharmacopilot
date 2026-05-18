export {};

declare global {
  interface Window {
    __PHARMACOPILOT_ENV__?: {
      VITE_WENDAO_DOMAIN?: string;
      WENDAO_DOMAIN?: string;
    };
  }
}
