const { default: axios } = require("axios");

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;

// التعديل هنا: نستخدم المتغير البيئي ونضيف له /api
// لاحظ أننا نستخدم BACKTICKS (`) وليس علامات تنصيص عادية
const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
// const apiUrl = "http://localhost:1337/api";

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

module.exports = axiosClient;
