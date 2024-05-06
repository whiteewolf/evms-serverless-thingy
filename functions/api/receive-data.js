export async function onRequestGet(context) {
  const { env } = context;

  // Fetch all keys from the KV namespace
  const keys = await env.MY_KV.list();

  const data = await Promise.all(
    keys.keys.map(async (key) => {
      // const value = await env.MY_KV.get(key.name);
      return { key: key.name, value: value ? JSON.parse(value) : null };
    })
  );

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
