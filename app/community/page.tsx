import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

// Q&Aと企業レビューを表示。並び替え・返信投稿・通報は今後クライアントコンポーネント化して実装。

async function getQuestions() {
  const { data } = await supabase
    .from('qa_questions')
    .select('*, answers:qa_answers(*), user:users(nickname), company:companies(name)')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(20);
  return data ?? [];
}

async function getReviews() {
  const { data } = await supabase
    .from('company_reviews')
    .select('*, replies:review_replies(*), user:users(nickname), company:companies(name)')
    .eq('is_hidden', false)
    .order('helpful_count', { ascending: false })
    .limit(20);
  return data ?? [];
}

export default async function CommunityPage() {
  const [questions, reviews] = await Promise.all([getQuestions(), getReviews()]);

  return (
    <div id="community" className="view active">
      <a href="/" className="back-link">‹ ホームに戻る</a>
      <h2>チケラー掲示板</h2>

      <div className="section-label" style={{ marginTop: 16 }}>Q&amp;A掲示板</div>
      {questions.length === 0 && <div className="empty">まだ質問がありません。</div>}
      {questions.map((q: any) => (
        <div className="qa-item" key={q.id}>
          <div className="qa-title">{q.title}</div>
          <div className="qa-meta">
            {q.user?.nickname ?? '匿名'}・{q.company?.name ?? '全般'}
          </div>
          {q.answers?.[0] && (
            <div className="qa-answer">
              <div className="qa-answer-meta">回答</div>
              {q.answers[0].body}
            </div>
          )}
        </div>
      ))}

      <div className="section-label">企業レビュー</div>
      {reviews.length === 0 && <div className="empty">まだレビューがありません。</div>}
      {reviews.map((r: any) => (
        <div className="review-item" key={r.id}>
          <div className="review-header">
            <div>
              <span className="chip">{r.company?.name}</span>
              <span className="muted-small" style={{ marginLeft: 6 }}>
                {r.user?.nickname ?? '匿名'}
              </span>
              <div className="stars">{'★'.repeat(Math.round(
                (r.rating_response + r.rating_payment_speed + r.rating_facility + r.rating_clarity) / 4
              ))}</div>
            </div>
          </div>
          <div className="review-comment">{r.comment}</div>
          <div className="review-footer">
            <span>参考になった ({r.helpful_count})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
