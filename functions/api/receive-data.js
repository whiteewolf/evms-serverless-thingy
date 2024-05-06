export async function onRequestPost(context) {
    const { request } = context;
  
    // Parse the incoming data from the request body
    const data = await request.json();
  
    console.log('Data received:', data); // Log the data (for debugging or monitoring purposes)
  
    return new Response(JSON.stringify({ status: 'success', message: 'Data received successfully' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
