import { supabase } from '@/lib/supabase';
import { Trial } from '@/lib/types';
import TrialList from '@/components/TrialList';

export const runtime = 'edge';
export const revalidate = 300; // 5分ごとに再生成(頻繁すぎるDBアクセスを避ける)

async function getPublishedTrials(): Promise<Trial[]> {
  const { data, error } = await supabase
    .from('trials')
    .select('*, company:companies(*)')
    .eq('is_published', true)
    .order('reward_amount_max', { ascending: false });

  if (error) {
    console.error('治験の取得に失敗しました', error);
    return [];
  }
  return data as unknown as Trial[];
}

export default async function HomePage() {
  const trials = await getPublishedTrials();

  return (
    <div id="home" className="view active">
      <div className="hero">
        <h1>アメリカの治験を、まとめて、リアルタイムに。</h1>
      </div>
      <TrialList initialTrials={trials} />
    </div>
  );
}
