export default async function handler(req, res) {
  const { url, headers } = req;
  const request = { url, headers };
  const result = await handleRequest(request);

  res.status(result.status).send(String(result.body));
}

const VALID_TOKENS = [
   { token: 'rediptvadmin', expires: '2024-10-20' },
  // Add more tokens with expiration dates

];

const ALLOWED_IP_PREFIX = process.env.ALLOWED_IP_PREFIX || '192.';
const REQUIRED_USER_AGENT_SUBSTRING = process.env.REQUIRED_USER_AGENT_SUBSTRING || 'TiviMate/4.7';

function isValidToken(token) {
  const currentDate = new Date();
  for (const validToken of VALID_TOKENS) {
    if (validToken.token === token) {
      const expirationDate = new Date(validToken.expires);
      return expirationDate >= currentDate; // Check if the token is not expired
    }
  }
  return false; // Token not found in the valid tokens list
}

function isAllowedIP(request) {
  const requestIP =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    request.headers.get('Remote-Addr') ||
    request.headers.get('X-Real-IP') ||
    request.headers.get('True-Client-IP') ||
    request.headers.get('X-Client-IP') ||
    request.headers.get('X-Cluster-Client-IP') ||
    request.headers.get('X-Forwarded') ||
    request.headers.get('Forwarded-For') ||
    request.headers.get('Forwarded');

  return requestIP && requestIP.startsWith(ALLOWED_IP_PREFIX);
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const userAgent = request.headers.get('User-Agent');
  const acceptHeader = request.headers.get('Accept');
  const refererHeader = request.headers.get('Referer');

  if (
    isAllowedIP(request) &&
    userAgent && userAgent.includes(REQUIRED_USER_AGENT_SUBSTRING) &&
    token && isValidToken(token) &&
    (!acceptHeader || !acceptHeader.includes('text/html')) &&
    !refererHeader
  ) {
    // Your embedded M3U content
    const m3uContent = `
      #EXTINF:-1 group-title="EXPIRES ON ${getExpiryDate(token)}",EXPIRY INFO
      http://example.com/stream1
      #EXTINF:-1 group-title="EXPIRES ON ${getExpiryDate(token)}",EXPIRY INFO
      http://example.com/stream2
      #EXTINF:-1 group-title="EXPIRES ON ${getExpiryDate(token)}",EXPIRY INFO
      http://example.com/stream3
      # ... (add more channels as needed)
    `;

    // Modify the content and add IPTV channel group name
    const expirationDate = VALID_TOKENS.find(validToken => validToken.token === token)?.expires;
    const channelGroupName = expirationDate ? `TokenValidUntil${expirationDate.replace(/-/g, '')}` : 'UnknownGroup';
    const modifiedContent = `#EXTM3U\n#EXTINF:-1 group-title="${channelGroupName}",Channel Name\n${m3uContent}`;

    // Return the modified content as the response
    return { body: modifiedContent, status: 200 };
  } else {
    return { body: 'Access denied.', status: 403 };
  }
}

// Helper function to format the expiration date
function getExpiryDate(token) {
  const expirationDate = VALID_TOKENS.find(validToken => validToken.token === token)?.expires;
  return expirationDate ? expirationDate : 'UnknownDate';
}
