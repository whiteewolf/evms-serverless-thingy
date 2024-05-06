export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json(); // Try parsing the incoming JSON

    const key = `data:${new Date().getTime()}`; // Create a unique key

    // Try storing the data in KV
    await env.MY_KV.put(key, JSON.stringify(data));

    return new Response(
      JSON.stringify({ status: 'success', message: 'Data stored successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Ensure proper CORS configuration
        },
      }
    );
  } catch (error) {
    console.error('Error in serverless function:', error); // Log the error for debugging

    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Ensure proper CORS configuration
        },
      }
    );
  }
}
