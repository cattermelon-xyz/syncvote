const { supabase } = require('../configs/supabaseClient');
const axios = require('axios');
// TODO: wrong place! should place inside votemachine
const createTopic = async (props) => {
  try {
    if (!props.title || !props.raw || !props.org_id) {
      throw new Error('Title, content, and org_id are all required!');
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

    const discourseData = {
      title: props.title,
      raw: props.raw,
      category: discourseConfig.category_id,
    };

    // Make API call to Discourse
    const response = await axios.post(
      discourseConfig.id_string.includes('http')
        ? `${discourseConfig.id_string}/posts`
        : `https://${discourseConfig.id_string}/posts`,
      discourseData,
      {
        headers: {
          'Api-Key': discourseConfig.access_token,
          'Api-Username': discourseConfig.username,
        },
      }
    );

    const firstPostId = response?.data?.id;
    const topicId = response?.data?.topic_id;
    const linkDiscourse = `https://${discourseConfig.id_string}/t/welcome-to-syncvote/${topicId}`;

    const dataAfterCreate = {
      firstPostId,
      topicId,
      linkDiscourse,
    };

    return { data: dataAfterCreate };
  } catch (e) {
    console.error('Error creating topic:', e.data);
    return { error: e };
  }
};

const getPosts = async (props) => {
  if (!props.topic_id || !props.org_id) {
    throw new Error('Topic_id and org_id are all required!');
  }

  try {
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

    // Make API call to Discourse to get posts
    const response = await axios.get(
      `http://${discourseConfig.id_string}/t/${props.topic_id}.json`,
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

const moveTopic = async (props) => {
  if (!props.topic_id || !props.org_id || !props.category_id) {
    throw new Error('Topic_id, category_id and org_id are all required!');
  }

  try {
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
    discourseConfig.id_string = discourseConfig.id_string.includes('https')
      ? discourseConfig.id_string
      : 'https://' + discourseConfig.id_string;

    const url = `${discourseConfig.id_string}/t/-/${props.topic_id}.json`;

    const payload = {
      category_id: props.category_id,
    };

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
  moveTopic,
};
