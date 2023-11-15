const { supabase } = require('../configs/supabaseClient');
const axios = require('axios');

const createPost = async (reqBody) => {
  try {
    if (!reqBody.topic_id || !reqBody.raw || !reqBody.org_id) {
      throw new Error('Topic id, content, and OrgId are all required!');
    }

    const { data, error } = await supabase
      .from('web2_key')
      .select('*')
      .eq('org_id', reqBody.org_id);

    if (error || data.length === 0) {
      throw new Error(error || 'No Discourse configuration found.');
    }

    const filteredDiscourse = data.filter(
      (integration) => integration.provider === 'discourse'
    );
    const discourseConfig = filteredDiscourse[0];

    console.log('discourseConfig', discourseConfig);
    console.log(`https://${discourseConfig.id_string}/posts`);

    const payload = {
      raw: reqBody.raw,
      topic_id: reqBody.topic_id,
    };

    console.log('payload', payload);

    // Make API call to Discourse
    const response = await axios.post(
      `http://${discourseConfig.id_string}/posts`,
      payload,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );

    return response.data;
  } catch (e) {
    console.error('Error creating post:', e);
    throw e;
  }
};

module.exports = {
  createPost,
};
