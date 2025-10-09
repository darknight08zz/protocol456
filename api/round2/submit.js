// api/round2/submit.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { teamId, choice, roundNumber } = await request.json();

  if (!teamId || !choice || ![1,2,3,4,5,6,7,8,9,10].includes(roundNumber)) {
    return response.status(400).json({ error: 'Invalid input' });
  }

  if (!['cooperate', 'selfish'].includes(choice)) {
    return response.status(400).json({ error: 'Invalid choice' });
  }

  try {
    // Check if round is already locked
    const { data: round, error: roundErr } = await supabase
      .from('rounds')
      .select('is_locked')
      .eq('round_number', roundNumber)
      .single();

    if (roundErr || round?.is_locked) {
      return response.status(400).json({ error: 'Round is closed' });
    }

    // Save submission
    const { error: subErr } = await supabase
      .from('submissions')
      .insert({
        team_id: teamId,
        round_number: roundNumber,
        choice
      });

    if (subErr) throw subErr;

    return response.status(200).json({ status: 'submitted' });
  } catch (err) {
    console.error('Submit error:', err);
    return response.status(500).json({ error: 'Submission failed' });
  }
}