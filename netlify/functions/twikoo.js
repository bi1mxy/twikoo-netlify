const twikoo = require('twikoo-netlify');

exports.handler = async (event, context) => {
  // 处理预检请求（OPTIONS）- 这是CORS的关键！
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://bi1mxy.github.io',
        'Access-Control-Allow-Headers': 'Content-Type, Origin',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  try {
    // 调用原来的处理函数
    const result = await twikoo(event, context);
    
    // 为响应添加CORS头
    return {
      ...result,
      headers: {
        ...result.headers,
        'Access-Control-Allow-Origin': 'https://bi1mxy.github.io',
        'Access-Control-Allow-Headers': 'Content-Type, Origin',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    };
  } catch (error) {
    // 错误处理也要加CORS头
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://bi1mxy.github.io',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
