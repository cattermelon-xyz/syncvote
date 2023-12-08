const Arweave = require('arweave');

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
    console.log('https://arweave.net/' + metadataTransaction.id);

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

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;

    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

module.exports = {
  convertToCron,
  isArraySubset,
  createArweave,
  extractCurrentCheckpointId,
  deepEqual,
};
