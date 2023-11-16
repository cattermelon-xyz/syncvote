const { supabase } = require('../configs/supabaseClient');
const axios = require('axios');

const createTopic = async (props) => {
  const { discourseConfig } = props;
  try {
    if (!props.title || !props.raw || !props.org_id) {
      throw new Error('Title, content, and org_id are all required!');
    }

    console.log('discourseConfig', discourseConfig);
    console.log(`http://${discourseConfig.id_string}/posts`);

    const discourseData = {
      title: props.title,
      raw: props.raw,
      category: discourseConfig.category_id,
    };

    // Make API call to Discourse
    const response = await axios.post(
      `http://${discourseConfig.id_string}/posts`,
      discourseData,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );

    return {
      data: response.data,
    };
  } catch (e) {
    console.error('Error creating topic:', e);
    return { error: e };
  }
};

const getPosts = async (reqBody) => {
  if (!reqBody.topic_id || !reqBody.org_id) {
    throw new Error('Topic_id and org_id are all required!');
  }

  try {
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

    // Make API call to Discourse to get posts
    const response = await axios.get(
      `http://${discourseConfig.id_string}/t/${reqBody.topic_id}.json`,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );

    return response.data;
  } catch (e) {
    console.error('Error get post:', e);
    throw e;
  }
};

const updateCategory = async (reqBody) => {
  if (!reqBody.topic_id || !reqBody.org_id || !reqBody.category_id) {
    throw new Error('Topic_id, category_id and org_id are all required!');
  }

  try {
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

    const url = `http://${discourseConfig.id_string}/t/-/${reqBody.topic_id}.json`;

    const payload = {
      category_id: reqBody.category_id,
    };

    console.log('payload', payload);

    const response = await axios.put(url, payload, {
      headers: {
        'Api-Key': discourseConfig.access_token,
        'Api-Username': discourseConfig.username,
      },
    });

    return response.data;
  } catch (e) {
    console.error('Error get post:', e);
    throw e;
  }
};

module.exports = {
  createTopic,
  getPosts,
  updateCategory,
};
