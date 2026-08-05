/**
 * ルートレイアウト（app/layout.tsx）の内側にネストされるため、
 * ここで <html> / <body> を描画してはいけない。
 * 描画するとタグが入れ子になり、ブラウザ側で破棄された結果
 * hydration mismatch が発生する。
 */
export default function StudioLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
