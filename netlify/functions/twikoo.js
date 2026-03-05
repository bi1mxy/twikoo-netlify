const twikooModule = require('twikoo-netlify');

exports.handler = async (event, context) => {
  // 处理预检请求 (OPTIONS)
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

  // 核心修改：尝试获取正确的处理函数
  const twikooHandler = twikooModule.handler || twikooModule;

  if (typeof twikooHandler !== 'function') {
    console.error('twikooHandler is not a function', twikooModule);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': 'https://bi1mxy.github.io' },
      body: JSON.stringify({ error: 'Twikoo handler not found' })
    };
  }

  try {
    // 调用获取到的处理函数
    const result = await twikooHandler(event, context);
    return {
      ...result,
      headers: {
        ...(result.headers || {}),
        'Access-Control-Allow-Origin': 'https://bi1mxy.github.io',
        'Access-Control-Allow-Headers': 'Content-Type, Origin',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': 'https://bi1mxy.github.io' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
