import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import turbo from "eslint-config-turbo/flat";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
    globalIgnores([
        "**/node_modules/**",
        "**/.next/**",
        // 旧 .eslintignore の「/studio」に相当
        "apps/purple-star/studio/**",
        "apps/four-pillars/studio/**",
    ]),

    // 共通ベース（旧 eslint-config-custom 相当）
    ...nextVitals,
    ...turbo,
    {
        settings: { next: { rootDir: ["apps/*/"] } },
        rules: {
            "@next/next/no-html-link-for-pages": "off",

            // eslint-plugin-react-hooks v6（React Compiler 由来）の新ルール。
            // 既存コードの修正が完了するまで一時的に warn へ降格
            "react-hooks/static-components": "warn",
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/incompatible-library": "warn",
            "react-hooks/refs": "warn",
        },
    },

    // purple-star / four-pillars 固有（旧 .eslintrc 相当）
    {
        files: ["apps/purple-star/**", "apps/four-pillars/**"],
        rules: {
            "react/jsx-no-target-blank": [2, { allowReferrer: true }],
            "react/display-name": [0, { ignoreTranspilerName: false }],
        },
    },
    {
        files: ["apps/purple-star/**/*.js", "apps/four-pillars/**/*.js"],
        rules: { "import/no-anonymous-default-export": "off" },
    },

    // Prettierとの競合回避は必ず最後に
    prettier,
]);