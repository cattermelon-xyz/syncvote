const Arweave = require('arweave');
const { supabase } = require('../configs/supabaseClient');

function isArraySubset(subset, superset) {
  return subset.some((item) => superset.includes(item));
}

async function createArweave(metadata) {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false,
    });
    const wallet = JSON.parse(process.env.ARWEAVE_KEY);
    const metadataRequest = JSON.stringify(metadata);
    const metadataTransaction = await arweave.createTransaction({
      data: metadataRequest,
    });
    await arweave.transactions.sign(metadataTransaction, wallet);

    await fetch('https://arweave.net/tx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadataTransaction),
    });

    return { arweave_id: 'https://arweave.net/' + metadataTransaction.id };
  } catch (error) {
    return { error: error };
  }
}

function convertToCron(momentDate) {
  const minutes = momentDate.minutes();
  const hours = momentDate.hours();
  const dayOfMonth = momentDate.date();
  const month = momentDate.month() + 1;
  const dayOfWeek = '*';

  // Return in the format "minutes hours dayOfMonth month dayOfWeek"
  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

function extractCurrentCheckpointId(inputStr) {
  const parts = inputStr.split('-');
  if (parts.length <= 1) {
    return null;
  }
  parts.shift();
  return parts.join('-');
}

async function upsertVariable(mission, variableName, dataToStore) {
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

async function selectVariable(mission, variableName) {
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

module.exports = {
  convertToCron,
  isArraySubset,
  createArweave,
  extractCurrentCheckpointId,
  upsertVariable,
  selectVariable,
};
