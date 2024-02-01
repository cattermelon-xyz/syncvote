import Arweave from 'npm:arweave@^1.14.4';

export function isArraySubset(subset: any, superset: any) {
  return subset.some((item: any) => superset.includes(item));
}

export async function createArweave(metadata: any) {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false,
    });
    const wallet = JSON.parse(Deno.env.get('ARWEAVE_KEY') ?? '{}');
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
    console.log(error);
    return { error: error };
  }
}

export function convertToCron(momentDate: any) {
  const minutes = momentDate.minutes();
  const hours = momentDate.hours();
  const dayOfMonth = momentDate.date();
  const month = momentDate.month() + 1;
  const dayOfWeek = '*';

  // Return in the format "minutes hours dayOfMonth month dayOfWeek"
  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function extractCurrentCheckpointId(inputStr: string) {
  const parts = inputStr.split('-');
  if (parts.length <= 1) {
    return null;
  }
  parts.shift();
  return parts.join('-');
}
