// api/round2/join.js
import { createClient } from '@supabase/supabase-js';

// Vercel serverless function
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { teamName, members } = await request.json();

  if (!teamName || !Array.isArray(members) || members.length === 0) {
    return response.status(400).json({ error: 'Team name and members required' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // ... (same logic as before: create team, members, etc.)
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .insert({ name: teamName.trim() })
      .select()
      .single();

    if (teamErr) throw teamErr;

    const validMembers = members.filter(m => m.trim());
    if (validMembers.length === 0) {
      return response.status(400).json({ error: 'At least one valid member needed' });
    }

    const memberRows = validMembers.map(name => ({
      team_id: team.id,
      name: name.trim()
    }));

    const { error: memErr } = await supabase
      .from('team_members')
      .insert(memberRows);

    if (memErr) throw memErr;

    await supabase.from('scores').insert({ team_id: team.id });

    // Ensure round 1 exists
    const { data: round } = await supabase
      .from('rounds')
      .select()
      .eq('round_number', 1)
      .maybeSingle();

    if (!round) {
      await supabase.from('rounds').insert({ round_number: 1 });
    }

    return response.status(200).json({
      success: true,
      teamId: team.id,
      currentRound: 1
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: 'Team creation failed' });
  }
}