export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Parse the incoming request data
    const data = await request.json();

    // Use a unique key to store data in Workers KV
    const key = `data:${new Date().getTime()}`;

    // Store the data in the KV namespace
    await env.MY_KV.put(key, JSON.stringify(data));

    return new Response(
      JSON.stringify({ status: 'success', message: 'Data stored successfully' }),
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error in serverless function:', error);

    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
