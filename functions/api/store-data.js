export async function onRequestPost(context) {
 try {
  const data = await request.json(); // Ensure valid JSON parsing
  const key = `data:${new Date().getTime()}`; // Create a unique key
  await env.MY_KV.put(key, JSON.stringify(data)); // Store data in KV

  return new Response(
    JSON.stringify({ status: 'success', message: 'Data stored successfully' }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
} catch (error) {
  console.error('Error in serverless function:', error); // Log the error for debugging

  return new Response(
    JSON.stringify({ status: 'error', message: 'An error occurred' }), // Return a valid JSON object even on error
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
}
