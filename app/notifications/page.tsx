export const runtime = 'edge';

// TODO: notification_settings テーブルの読み書きに接続する。
// 未ログイン時は /signup にリダイレクト。

export default function NotificationsPage() {
  return (
    <div id="notifications" className="view active">
      <a href="/" className="back-link">‹ ホームに戻る</a>
      <h2>通知設定</h2>

      <div className="block-label">通知方法</div>
      <div className="field" style={{ marginBottom: 24 }}>
        <select>
          <option>LINE</option>
          <option>プッシュ通知</option>
          <option>メール</option>
        </select>
      </div>

      <div className="block-label">新着治験のアラート</div>
      <div className="block-sub">条件に合う治験が公開されたら通知します</div>
      <div className="toggle-row">
        <div style={{ fontSize: 14 }}>新着治験を通知する</div>
        <button className="toggle-track on" type="button">
          <div className="toggle-thumb" />
        </button>
      </div>
      <div className="sub-block">
        <div className="label">対象企業</div>
        <select style={{ width: '100%' }}>
          <option>すべての企業</option>
        </select>
      </div>
      <div className="sub-block">
        <div className="label">最低報酬額</div>
        <select style={{ width: '100%' }}>
          <option>指定なし</option>
          <option>$3,000以上</option>
          <option>$5,000以上</option>
        </select>
      </div>

      <div className="block-label" style={{ marginTop: 8 }}>次回参加可能日のリマインド</div>
      <div className="block-sub">マイページの休薬期間明けが近づいたら通知します</div>
      <div className="toggle-row">
        <div style={{ fontSize: 14 }}>リマインドを受け取る</div>
        <button className="toggle-track off" type="button">
          <div className="toggle-thumb" />
        </button>
      </div>
      <div className="sub-block">
        <div className="label">何日前に通知するか</div>
        <select style={{ width: '100%' }}>
          <option>3日前</option>
          <option>7日前</option>
        </select>
      </div>

      <button className="primary-btn">保存する</button>
    </div>
  );
}
