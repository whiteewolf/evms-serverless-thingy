export async function onRequest(context) {
  const { request, env } = context;

  // Check the request method and route accordingly
  switch (request.method) {
    case 'POST':
      return handlePostRequest(request, env);
    case 'GET':
      return handleGetRequest(env);
    default:
      // Return 405 for any other method
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Ensure CORS is set
          },
        }
      );
  }
}

// Handle POST requests
async function handlePostRequest(request, env) {
  try {
    const data = await request.json(); // Parse incoming JSON data

    // Store data in Workers KV
    const key = `data:${new Date().getTime()}`; // Create a unique key
    await env.MY_KV.put(key, JSON.stringify(data));

    return new Response(
      JSON.stringify({ status: 'success', message: 'Data stored successfully' }),
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error handling POST request:', error);

    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}

// Handle GET requests
async function handleGetRequest(env) {
  try {
    // List all keys in the Workers KV namespace
    const keys = await env.MY_KV.list();

    const data = await Promise.all(
      keys.keys.map(async (key) => {
        const value = await env.MY_KV.get(key.name);
        return { key: key.name, value: value ? JSON.parse(value) : null };
      })
    );

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Ensure CORS
        },
      }
    );
  } catch (error) {
    console.error('Error handling GET request:', error);

    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
