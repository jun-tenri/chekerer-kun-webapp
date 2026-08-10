'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Trial, formatReward } from '@/lib/types';

export default function TrialList({ initialTrials }: { initialTrials: Trial[] }) {
  const [companyFilter, setCompanyFilter] = useState('');
  const [sort, setSort] = useState<'reward_desc' | 'new'>('reward_desc');

  const companies = useMemo(
    () => Array.from(new Set(initialTrials.map((t) => t.company?.name).filter(Boolean))),
    [initialTrials]
  );

  const trials = useMemo(() => {
    let items = initialTrials.filter((t) => !companyFilter || t.company?.name === companyFilter);
    if (sort === 'reward_desc') {
      items = [...items].sort((a, b) => (b.reward_amount_max ?? 0) - (a.reward_amount_max ?? 0));
    } else {
      items = [...items].sort(
        (a, b) => new Date(b.fetched_at).getTime() - new Date(a.fetched_at).getTime()
      );
    }
    return items;
  }, [initialTrials, companyFilter, sort]);

  return (
    <>
      <div className="filters">
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
          <option value="">企業: すべて</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as 'reward_desc' | 'new')}>
          <option value="reward_desc">謝礼金額順</option>
          <option value="new">新着順</option>
        </select>
      </div>

      <div className="section-label">現在募集中・{trials.length}件</div>

      <div id="list">
        {trials.length === 0 && <div className="empty">条件に合う治験が見つかりませんでした。</div>}
        {trials.map((t) => (
          <Link key={t.id} href={`/trials/${t.id}`} className="trial-row" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>
              <div className="meta-row">
                <span className="chip">{t.company?.name}</span>
                <span className="muted-small">
                  {t.source_type === 'instagram' ? 'Instagram' : '公式サイト'}取得
                </span>
              </div>
              <div className="trial-title">{t.title_ja}</div>
              {t.hospitalization_start && t.hospitalization_end && (
                <div className="trial-info">
                  入院期間　{t.hospitalization_start}－{t.hospitalization_end}
                </div>
              )}
              {t.outpatient_visits != null && (
                <div className="trial-info">外来回数　{t.outpatient_visits}回</div>
              )}
            </div>
            <div className="trial-reward">
              <div className="amount">{formatReward(t)}</div>
              <div className="chevron">›</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
