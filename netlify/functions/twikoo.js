const twikooModule = require('twikoo-netlify');

exports.handler = async (event, context) => {
  // 设置超时（Netlify 函数最大支持 10 秒）
  context.callbackWaitsForEmptyEventLoop = false;
  
  // 通用 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': 'https://bi1mxy.github.io',
    'Access-Control-Allow-Headers': 'Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };

  // 记录请求开始
  console.log('收到请求', { 
    method: event.httpMethod, 
    path: event.path,
    headers: event.headers 
  });

  // 处理预检请求 (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    console.log('处理 OPTIONS 预检请求');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 尝试获取正确的处理函数
  const twikooHandler = twikooModule.handler || twikooModule;

  if (typeof twikooHandler !== 'function') {
    console.error('twikooHandler is not a function', twikooModule);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Twikoo handler not found' })
    };
  }

  try {
    console.log('开始调用 twikooHandler');
    
    // 调用获取到的处理函数
    const result = await twikooHandler(event, context);
    
    console.log('twikooHandler 调用成功', { 
      hasResult: !!result,
      statusCode: result?.statusCode,
      hasHeaders: !!result?.headers
    });

    // 记录返回的响应内容（截取前200字符）
    if (result) {
      const resultStr = JSON.stringify(result);
      console.log('返回响应内容:', resultStr.substring(0, 200) + (resultStr.length > 200 ? '...' : ''));
    }

    // 合并 CORS 头并返回
    const finalResponse = {
      ...result,
      headers: {
        ...(result?.headers || {}),
        ...headers
      }
    };

    console.log('最终响应状态码:', finalResponse.statusCode);
    return finalResponse;

  } catch (error) {
    console.error('函数执行错误:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        type: error.name 
      })
    };
  }
};
