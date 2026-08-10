import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'チケラーくんが行く！',
  description: 'アメリカの日本人向け治験を、まとめて、リアルタイムに。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="app">
          <div className="topbar">
            <a
              className="line-btn"
              href="https://line.me/R/ti/p/@your_official_id"
              target="_blank"
              rel="noreferrer"
            >
              公式LINE追加
            </a>
            <Link href="/" className="brand" style={{ cursor: 'pointer', textDecoration: 'none' }}>
              <div className="brand-mark">
                <Image src="/chikeler-icon.png" alt="チケラーくん" width={76} height={76} />
              </div>
              <div className="brand-name">チケラーくんが行く！</div>
            </Link>
          </div>

          <div className="nav">
            <div className="links">
              {/* TODO: ログイン状態に応じて マイページ/登録 を出し分ける(プロトタイプのisLoggedInと同じロジック) */}
              <Link href="/mypage">マイページ</Link>
              <Link href="/community">チケラー掲示板</Link>
              <Link href="/notifications">通知設定</Link>
              <Link href="/signup">登録</Link>
            </div>
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}
