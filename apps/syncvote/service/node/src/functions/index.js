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

module.exports = {
  convertToCron,
  isArraySubset,
  createArweave,
};
