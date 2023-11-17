const { supabase } = require('../configs/supabaseClient');
const axios = require('axios');

const createPost = async (props) => {
  const { discourseConfig } = props;

  try {
    if (!props.topic_id || !props.raw || !props.org_id) {
      throw new Error('Topic id, content, and OrgId are all required!');
    }

    console.log('discourseConfig', discourseConfig);
    console.log(`https://${discourseConfig.id_string}/posts`);

    const payload = {
      raw: props.raw,
      topic_id: props.topic_id,
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
  } catch (e) {
    console.error('Error creating post:', e);
    return { error: e };
  }
};

module.exports = {
  createPost,
};
