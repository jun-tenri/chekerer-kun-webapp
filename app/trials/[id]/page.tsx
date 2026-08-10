import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Trial, formatReward } from '@/lib/types';

export const runtime = 'edge';

async function getTrial(id: string): Promise<Trial | null> {
  const { data, error } = await supabase
    .from('trials')
    .select('*, company:companies(*)')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data as unknown as Trial;
}

export default async function TrialDetailPage({ params }: { params: { id: string } }) {
  const t = await getTrial(params.id);
  if (!t) notFound();

  return (
    <div id="detail" className="view active">
      <a href="/" className="back-link">‹ 一覧に戻る</a>

      <div className="meta-row">
        <span className="chip">{t.company?.name}</span>
        <span className="muted-small">
          {t.source_type === 'instagram' ? 'Instagram' : '公式サイト'}取得
        </span>
      </div>
      <h2>{t.title_ja}</h2>

      <div className="stat-pair">
        <div>
          <div className="stat-label">謝礼金</div>
          <div className="stat-value">{formatReward(t)}</div>
        </div>
        {t.hospitalization_start && t.hospitalization_end && (
          <div>
            <div className="stat-label">入院期間</div>
            <div className="stat-value" style={{ fontSize: 16 }}>
              {t.hospitalization_start}－{t.hospitalization_end}
            </div>
          </div>
        )}
      </div>

      {t.ai_summary_ja && (
        <>
          <div className="about-label">この治験について</div>
          <div className="about">{t.ai_summary_ja}</div>
        </>
      )}

      <table className="info">
        <tbody>
          {t.outpatient_visits != null && (
            <tr><td>外来回数</td><td>{t.outpatient_visits}回</td></tr>
          )}
          {t.target_text && <tr><td>対象</td><td>{t.target_text}</td></tr>}
          {t.location_text && <tr><td>拠点</td><td>{t.location_text}</td></tr>}
          {t.japanese_support_text && (
            <tr><td>言語サポート</td><td>{t.japanese_support_text}</td></tr>
          )}
          {t.source_url && (
            <tr>
              <td>情報元</td>
              <td><a href={t.source_url} target="_blank" rel="noreferrer">公式情報を見る →</a></td>
            </tr>
          )}
        </tbody>
      </table>

      {t.company?.official_site_url && (
        <a
          className="apply-btn"
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
          // TODO: トラッキング用パラメータを付与する(?ref=chikelerkun 等)。提携後に実績を示す材料にする。
          href={`${t.company.official_site_url}?ref=chikelerkun`}
          target="_blank"
          rel="noreferrer"
        >
          {t.company.name}公式で応募する ↗
        </a>
      )}
      <div className="apply-note">応募・審査は企業側で行われます。当サイトは情報提供のみを行います。</div>
    </div>
  );
}
