const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";

export function getCurrentTOTP(): string {
  const timeStep = Math.floor(Date.now() / 30000);
  const str = `eas-secret-salt-${timeStep}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash % 1000000).toString().padStart(6, '0');
}

let cachedChannelId: string | null = null;

export async function sendCodeToDiscord() {
  const code = getCurrentTOTP();
  
  try {
    if (!cachedChannelId) {
      // 1. Fetch guilds
      const guildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
      });
      if (!guildsRes.ok) throw new Error("Failed to fetch guilds");
      const guilds = await guildsRes.json();
      
      if (guilds.length === 0) throw new Error("Bot is not in any guilds");
      
      // 2. Fetch channels for the first guild
      const guildId = guilds[0].id;
      const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
      });
      
      if (!channelsRes.ok) throw new Error("Failed to fetch channels");
      const channels = await channelsRes.json();
      
      // 3. Find channel named 'code'
      const codeChannel = channels.find((c: any) => c.name === "code" || c.name === "code-channel");
      if (!codeChannel) throw new Error("Could not find a channel named 'code'");
      
      cachedChannelId = codeChannel.id;
    }

    // 4. Send message
    await fetch(`https://discord.com/api/v10/channels/${cachedChannelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `Here is the current access code (expires in 30 seconds): **${code}**`
      })
    });
    
  } catch (err) {
    console.error("Discord Bot Error:", err);
  }
}
