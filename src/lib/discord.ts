const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";

export function getCurrentTOTP(): string {
  const timeStep = Math.floor(Date.now() / 30000);
  return generateTOTPForStep(timeStep);
}

function generateTOTPForStep(timeStep: number): string {
  const str = `eas-secret-salt-${timeStep}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash % 1000000).toString().padStart(6, '0');
}

export function validateTOTP(code: string): boolean {
  const timeStep = Math.floor(Date.now() / 30000);
  if (generateTOTPForStep(timeStep) === code) return true;
  if (generateTOTPForStep(timeStep - 1) === code) return true;
  return false;
}

export async function sendCodeToDiscord() {
  const code = getCurrentTOTP();
  
  try {
    const channelId = "1527875649732087899";

    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
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
