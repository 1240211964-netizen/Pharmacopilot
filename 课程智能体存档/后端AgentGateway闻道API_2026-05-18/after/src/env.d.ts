export {};

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare global {
  interface Window {
    __PHARMACOPILOT_ENV__?: {
      VITE_WENDAO_DOMAIN?: string;
      WENDAO_DOMAIN?: string;
    };
  }
}
