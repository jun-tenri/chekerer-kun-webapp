export const runtime = 'edge';

// TODO: 実装時にやること
// 1. Supabase Authのセッションからログイン中のuser_idを取得。未ログインなら /signup にリダイレクト。
// 2. user_participations を end_date 降順で取得。
// 3. 累計参加回数 = 件数、累計報酬額 = reward_amountの合計。
// 4. 次回参加可能日 = 最新のend_date + COALESCE(washout_period_days, trials.washout_period_days, 30)

export default function MyPage() {
  return (
    <div id="mypage" className="view active">
      <a href="/" className="back-link">‹ ホームに戻る</a>
      <h2>マイページ</h2>

      <div className="mypage-stats">
        <div>
          <div className="stat-label">累計参加</div>
          <div className="stat-value">-回</div>
        </div>
        <div>
          <div className="stat-label">累計報酬額</div>
          <div className="stat-value">$-</div>
        </div>
        <div>
          <div className="stat-label">次回参加可能日</div>
          <div className="stat-value" style={{ color: 'var(--accent-deep)' }}>-</div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 0 }}>参加履歴</div>
      <div className="empty">まだ参加履歴がありません。</div>

      <button className="add-history-btn">+ 参加履歴を追加</button>
    </div>
  );
}
