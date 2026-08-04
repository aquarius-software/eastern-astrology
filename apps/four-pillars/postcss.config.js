// Tailwind CSS v4 では PostCSS プラグインが @tailwindcss/postcss に一本化され、
// ベンダープレフィックス付与（旧 autoprefixer）と @import の解決も内包する。
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
