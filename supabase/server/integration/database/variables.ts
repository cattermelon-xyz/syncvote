import { supabase } from '../../configs/supabaseClient.ts';

export async function upsertVariable(
  mission: any,
  variableName: string,
  dataToStore: any
) {
  const root_mission_id = mission.m_parent
    ? mission.m_parent
    : mission.mission_id;
  // check if mission_id, name existed
  const { data: existed, error: err } = await supabase
    .from('variables')
    .select('id')
    .eq('name', variableName)
    .eq('mission_id', root_mission_id);
  if (err) {
    return false;
  }
  if (existed.length > 0) {
    // update variables
    const { error: err } = await supabase
      .from('variables')
      .update({
        value: dataToStore,
      })
      .eq('name', variableName)
      .eq('mission_id', root_mission_id);
    if (err) {
      console.log('update variable error', err);
      return false;
    } else {
      return true;
    }
  } else {
    // insert variables
    const { error: err } = await supabase.from('variables').insert({
      name: variableName,
      value: dataToStore,
      mission_id: root_mission_id,
    });
    if (err) {
      return false;
    } else {
      return true;
    }
  }
}

export async function selectVariable(mission: any, variableName: string) {
  const root_mission_id = mission.m_parent
    ? mission.m_parent
    : mission.mission_id;
  const { data: variables, error } = await supabase
    .from('variables')
    .select('*')
    .eq('name', variableName)
    .eq('mission_id', root_mission_id);
  if (error) {
    return false;
  } else {
    return variables[0]?.value;
  }
}
