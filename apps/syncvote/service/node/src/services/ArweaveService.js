const { createArweave } = require('../functions');

async function uploadMetadata(props) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = props;
      const { arweave_id, error } = await createArweave(data);
      if (error) {
        resolve({
          status: 'ERR',
          message: `Cannot upload this metadata: ${error}`,
        });
      } else {
        resolve({
          status: 'OK',
          message: 'Upload metadata successfully',
          data: arweave_id,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  uploadMetadata,
};
