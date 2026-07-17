// TypeScript 6+ (TS2882) requires side-effect CSS imports to resolve to a
// module declaration. Next.js handles the actual CSS at build time.
declare module "*.css";
