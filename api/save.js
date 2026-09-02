export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const responseEntry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ...data,
    };

    console.log('🎉 NEW DATE ACCEPTED! Details:', JSON.stringify(responseEntry, null, 2));

    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `💖 **SHE SAID YES!**\n📅 **Date:** ${responseEntry.date || 'TBD'}\n⏰ **Time:** ${responseEntry.time || 'TBD'}\n📍 **Place:** ${responseEntry.place || 'TBD'}\n🍕 **Food:** ${responseEntry.food || 'TBD'}\n👗 **Outfit:** ${responseEntry.outfit || 'TBD'}\n💌 **Note:** ${responseEntry.notes || 'None'}`,
          }),
        });
      } catch (webhookErr) {
        console.warn('Webhook notification failed (non-fatal):', webhookErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Date response recorded successfully!',
      data: responseEntry,
    });
  } catch (error) {
    console.error('Error processing response:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

