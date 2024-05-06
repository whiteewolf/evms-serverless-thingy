export async function onRequestPost(context) {
  const { request, env } = context;

  const data = await request.json();

  const key = `data:${new Date().getTime()}`; // Create a unique key based on the timestamp

  // Store data in the KV namespace
  await env.MY_KV.put(key, JSON.stringify(data));

  return new Response(
    JSON.stringify({ status: 'success', message: 'Data stored successfully' }),
    {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    }
  );
}
