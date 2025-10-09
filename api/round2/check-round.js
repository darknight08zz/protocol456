// api/round2/check-round.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Core scoring logic
function calculatePoints(submissions, totalTeams) {
  const selfishCount = submissions.filter(s => s.choice === 'selfish').length;
  const coopCount = totalTeams - selfishCount;

  return submissions.map(sub => {
    let points = 0;
    if (selfishCount === 0) {
      // All cooperate
      points = 10;
    } else if (selfishCount < totalTeams / 2) {
      // Less than half selfish
      if (sub.choice === 'selfish') {
        points = 15;
      } else {
        const totalBandwidth = 10 * totalTeams;
        const selfishBandwidth = 15 * selfishCount;
        const coopBandwidth = totalBandwidth - selfishBandwidth;
        points = coopBandwidth / coopCount;
      }
    } else {
      // More than half selfish → clash
      if (sub.choice === 'selfish') {
        points = -10;
      } else {
        points = 0;
      }
    }
    return { ...sub, points_earned: Math.round(points) };
  });
}

export default async function handler(request, response) {
  const { roundNumber, teamId } = request.query;

  if (!roundNumber || !teamId) {
    return response.status(400).json({ error: 'Missing params' });
  }

  const roundNum = parseInt(roundNumber);
  if (roundNum < 1 || roundNum > 10) {
    return response.status(400).json({ error: 'Invalid round' });
  }

  try {
    // Get round
    const { data: round, error: roundErr } = await supabase
      .from('rounds')
      .select('*')
      .eq('round_number', roundNum)
      .single();

    if (roundErr || !round) {
      return response.status(404).json({ error: 'Round not found' });
    }

    if (round.is_locked) {
      // Round already scored — return result for this team
      const { data: submission } = await supabase
        .from('submissions')
        .select('points_earned')
        .eq('team_id', teamId)
        .eq('round_number', roundNum)
        .single();

      const { data: score } = await supabase
        .from('scores')
        .select('total_score')
        .eq('team_id', teamId)
        .single();

      return response.status(200).json({
        status: 'round_complete',
        selfishCount: 0, // not exposed after lock, but you can store it if needed
        pointsThisRound: submission?.points_earned || 0,
        totalScore: score?.total_score || 0,
        showScore: roundNum <= 5
      });
    }

    // Get all submissions for this round
    const { data: submissions, error: subErr } = await supabase
      .from('submissions')
      .select('id, team_id, choice')
      .eq('round_number', roundNum);

    if (subErr) throw subErr;

    // Get total teams
    const { data: teams, error: teamErr } = await supabase.from('teams').select('id');
    if (teamErr) throw teamErr;
    const totalTeams = teams.length;

    if (totalTeams === 0) {
      return response.status(400).json({ error: 'No teams' });
    }

    // Check if time is up (2 minutes)
    const now = new Date();
    const roundStart = new Date(round.started_at);
    const isTimeUp = (now - roundStart) > 2 * 60 * 1000; // 2 minutes

    // Score if all submitted or time is up
    if (submissions.length === totalTeams || isTimeUp) {
      // Lock the round
      await supabase
        .from('rounds')
        .update({ is_locked: true, locked_at: new Date().toISOString() })
        .eq('id', round.id);

      // Calculate scores
      const scoredSubs = calculatePoints(submissions, totalTeams);
      const selfishCount = scoredSubs.filter(s => s.choice === 'selfish').length;

      // Update submissions
      for (const sub of scoredSubs) {
        await supabase
          .from('submissions')
          .update({
            points_earned: sub.points_earned,
            is_finalized: true
          })
          .eq('id', sub.id);
      }

      // Update total scores
      const teamPoints = {};
      scoredSubs.forEach(s => {
        teamPoints[s.team_id] = (teamPoints[s.team_id] || 0) + s.points_earned;
      });

      for (const [tid, pts] of Object.entries(teamPoints)) {
        await supabase.rpc('update_score', { p_team_id: tid, p_points: pts });
      }

      // Get result for requesting team
      const teamSub = scoredSubs.find(s => s.team_id === teamId);
      const { data: finalScore } = await supabase
        .from('scores')
        .select('total_score')
        .eq('team_id', teamId)
        .single();

      return response.status(200).json({
        status: 'round_complete',
        selfishCount,
        pointsThisRound: teamSub?.points_earned || 0,
        totalScore: finalScore?.total_score || 0,
        showScore: roundNum <= 5
      });
    }

    // Still waiting
    return response.status(200).json({ status: 'waiting' });

  } catch (err) {
    console.error('Check-round error:', err);
    return response.status(500).json({ error: 'Check failed' });
  }
}