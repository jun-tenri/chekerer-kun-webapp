export const runtime = 'edge';

// TODO: Supabase Authのパスワードレス(Magic Link)と接続する。
// 参考: supabase.auth.signInWithOtp({ email })
// 送信後、name / nickname を users テーブルに保存する処理も必要。

export default function SignupPage() {
  return (
    <div id="signup" className="view active">
      <a href="/" className="back-link">‹ ホームに戻る</a>
      <h2>はじめる</h2>
      <div className="sub">新着治験の通知や参加履歴の管理が可能</div>

      <form>
        <div className="field">
          <label>お名前</label>
          <input type="text" name="name" placeholder="山田 太郎" required />
        </div>
        <div className="field">
          <label>ニックネーム(掲示板・レビューで表示されます)</label>
          <input type="text" name="nickname" placeholder="例: チケ太郎" required />
        </div>
        <div className="field">
          <label>メールアドレス</label>
          <input type="email" name="email" placeholder="name@example.com" required />
        </div>
        <button type="submit" className="primary-btn">認証リンクを送る</button>
      </form>
      <div className="form-note">パスワードは不要です。届いたメールのリンクからログインできます。</div>
    </div>
  );
}
