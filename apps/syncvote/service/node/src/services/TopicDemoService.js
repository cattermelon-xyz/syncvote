const { supabase } = require('../configs/supabaseClient');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const apiUserName = process.env.API_USERNAME;

const createTopic = async (reqBody) => {
  try {
    // Make API call to Discourse
    console.log('try: https://discourse.syncvote.shop/posts');
    console.log('apiKey: ', apiKey);
    console.log('api-username: ', apiUserName);
    const response = await axios.post(
      `https://discourse.syncvote.shop/posts`,
      {
        title: reqBody.title,
        raw: reqBody.raw,
        category: 4,
      },
      {
        headers: {
          'Api-Key': apiKey,
          'Api-Username': apiUserName,
        },
      }
    );

    const firstPostId = response?.data?.id;
    const topicId = response?.data?.topic_id;
    const linkDiscourse = `https://discourse.syncvote.shop/t/welcome-to-syncvote/${topicId}`;

    const { error } = await supabase
      .from('demo_missions')
      .update({
        topic_id: topicId,
        first_post_id: firstPostId,
        discourse_topic_id: linkDiscourse,
      })
      .eq('id', reqBody.id_mission);

    if (error) {
      console.log('error update data on supabase', error);
    }
    return response.data;
  } catch (e) {
    console.error('Error creating topic: ', e.message);
    throw {
      message: e.response.data.errors[0],
    };
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
  try {
    const { data, error } = await supabase
      .from('demo_missions')
      .select('*')
      .eq('id', reqBody.mission_id);

    if (error) {
      console.log('error update category', error);
    }
    console.log('data mission demo', data);

    let category_id;
    if (reqBody?.name_category === 'Formal Proposal') {
      category_id = 5;
    } else {
      category_id = 6;
    }

    const topicId = data[0]?.topic_id;

    const url = `https://discourse.syncvote.shop/t/-/${topicId}.json`;

    const payload = {
      category_id: category_id,
    };

    console.log('payload', payload);

    const response = await axios.put(url, payload, {
      headers: {
        'Api-Key': apiKey,
        'Api-Username': apiUserName,
      },
    });

    return response.data;
  } catch (e) {
    console.error('Error get post:', e);
    throw e;
  }
};

const updatePost = async (reqBody) => {
  try {
    const { data, error } = await supabase
      .from('demo_missions')
      .select('*')
      .eq('id', reqBody.mission_id);

    if (error) {
      console.log('error update post', error);
    }
    console.log('data mission demo', data);
    const postId = data[0]?.first_post_id;

    const url = `https://discourse.syncvote.shop/posts/${postId}.json`;

    const payload = {
      raw: reqBody.raw,
      edit_reason: 'Finalize the proposal',
    };
    const response = await axios.put(url, payload, {
      headers: {
        'Api-Key': apiKey,
        'Api-Username': apiUserName,
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
  updatePost,
};
