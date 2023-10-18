const Arweave = require('arweave');
const fs = require('fs');

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

    const response = await fetch('https://arweave.net/tx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadataTransaction),
    });
    console.log('Test: ', response);

    return { arweave_id: 'https://arweave.net/' + metadataTransaction.id };
  } catch (error) {
    return { error: error };
  }
}

module.exports = {
  isArraySubset,
  createArweave,
};
