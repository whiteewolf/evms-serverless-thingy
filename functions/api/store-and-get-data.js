export async function onRequest(context) {
  const { request, env } = context;

  switch (request.method) {
    case 'POST':
      return handlePostRequest(request, env);
    case 'GET':
      return handleGetRequest(env);
    default:
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
  }
}

// Function to handle POST requests
async function handlePostRequest(request, env) {
  try {
    const data = await request.json(); // Ensure valid JSON parsing

    const key = `data:${new Date().getTime()}`; // Create a unique key
    await env.MY_KV.put(key, JSON.stringify(data)); // Store the data in KV

    return new Response(
      JSON.stringify({ status: 'success', message: 'Data stored successfully' }),
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error handling POST request:', error);

    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}

// Function to handle GET requests
async function handleGetRequest(env) {
  try {
    // List all keys in the KV namespace
    const keys = await env.MY_KV.list();

    // Retrieve data from KV based on the keys
    const data = await Promise.all(
      keys.keys.map(async (key) => {
        const value = await env.MY_KV.get(key.name);
        return { key: key.name, value: JSON.parse(value) };
      })
    );

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Error handling GET request:', error);

    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
