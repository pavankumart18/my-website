// Prefix public assets with the deploy base path (e.g. /my-website on GitHub Pages).
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
