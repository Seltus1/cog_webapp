const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Always include CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const data = JSON.parse(event.body);
    const { session_id } = data;

    if (!session_id) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Missing session_id' }) 
      };
    }

    // Use upsert: if session_id exists, update it. 
    // This assumes session_id column is UNIQUE in your Supabase table.
    const { error } = await supabase
      .from('experiments')
      .upsert({ 
        session_id: session_id, 
        data: data 
      }, { onConflict: 'session_id' });

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'success', session_id })
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
