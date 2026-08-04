// Tailwind CSS v4 は CSS ファーストのため、HeroUI のプラグインは
// tailwind.config.js ではなくこのファイル経由で styles/tailwind.css の
// `@plugin` から読み込む。
import { heroui } from "@heroui/react";

export default heroui();
