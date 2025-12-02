const axios = require('axios');
const ML_BASE = process.env.ML_BASE || 'http://localhost:6000';

const client = axios.create({ baseURL: ML_BASE, timeout: 5000 });

exports.predictPrice = async (features) => {
  try {
    const res = await client.post('/predict_price', features);
    return res.data;
  } catch (err) {
    console.warn('ML predictPrice failed', err.message);
    return null;
  }
};

exports.recommend = async (payload) => {
  try {
    const res = await client.post('/recommend', payload);
    return res.data;
  } catch (err) {
    console.warn('ML recommend failed', err.message);
    return null;
  }
};
