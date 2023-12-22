const { supabase } = require('../configs/supabaseClient');
const axios = require('axios');

const createPost = async (props) => {
  try {
    if (!props.topic_id || !props.raw || !props.org_id) {
      throw new Error('Topic id, content, and OrgId are all required!');
    }
    const { data, error } = await supabase
      .from('web2_key')
      .select('*')
      .eq('org_id', props.org_id);

    if (error || data.length === 0) {
      throw new Error(error || 'No Discourse configuration found.');
    }

    const filteredDiscourse = data.filter(
      (integration) => integration.provider === 'discourse'
    );
    const discourseConfig = filteredDiscourse[0];

    const payload = {
      raw: props.raw,
      topic_id: props.topic_id,
    };

    // Make API call to Discourse
    const response = await axios.post(
      `https://${discourseConfig.id_string}/posts`,
      payload,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );
    const linkDiscourse = `https://${discourseConfig.id_string}/t/welcome-to-syncvote/${props.topic_id}`;

    return { data: { ...response.data, linkDiscourse: linkDiscourse } };
  } catch (e) {
    console.error('Error creating post:', e.data);
    return { error: e };
  }
};

module.exports = {
  createPost,
};
