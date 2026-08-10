// supabase/schema.sql と対応する型定義。
// 本来は `supabase gen types typescript` で自動生成するのが望ましいですが、
// ここでは手書きの最小限の型を用意しています。

export type Company = {
  id: string;
  name: string;
  official_site_url: string | null;
  instagram_handle: string | null;
  japanese_support: boolean;
  has_referral_program: boolean;
  referral_bonus_amount: number | null;
};

export type Trial = {
  id: string;
  company_id: string;
  title_ja: string;
  status: string;
  target_text: string | null;
  location_text: string | null;
  japanese_support_text: string | null;
  reward_amount_min: number | null;
  reward_amount_max: number | null;
  reward_currency: string;
  reward_confidence: 'confirmed' | 'estimated' | 'unknown';
  hospitalization_start: string | null;
  hospitalization_end: string | null;
  outpatient_visits: number | null;
  duration_text: string | null;
  washout_period_days: number | null;
  source_type: 'company_site' | 'instagram' | null;
  source_url: string | null;
  ai_summary_ja: string | null;
  is_published: boolean;
  fetched_at: string;
  // 一覧取得時にJOINして埋める(companiesテーブルから)
  company?: Company;
};

export function formatReward(t: Trial): string {
  if (t.reward_confidence !== 'confirmed' || !t.reward_amount_max) return '未定';
  if (t.reward_amount_min && t.reward_amount_min !== t.reward_amount_max) {
    return `最大$${t.reward_amount_max.toLocaleString()}`;
  }
  return `$${t.reward_amount_max.toLocaleString()}`;
}
