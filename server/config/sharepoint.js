// Microsoft Graph API authentication using OAuth 2.0 client credentials flow
// Token is fetched once and cached for its TTL (1 hour minus a 5-minute safety buffer)
const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

// Obtain (or return cached) Graph API access token
async function getGraphToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const tenantId = process.env.SP_TENANT_ID;
  const clientId = process.env.SP_CLIENT_ID;
  const clientSecret = process.env.SP_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    const err = new Error(
      'SharePoint credentials not configured — set SP_TENANT_ID, SP_CLIENT_ID, SP_CLIENT_SECRET'
    );
    err.code = 'SP_AUTH_FAILED';
    throw err;
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
    });

    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    cachedToken = response.data.access_token;
    // Cache slightly under the actual TTL to avoid using an about-to-expire token
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

    return cachedToken;
  } catch (err) {
    cachedToken = null;
    tokenExpiry = null;
    const spErr = new Error('Failed to obtain Graph API token — check SP_CLIENT_ID/SECRET/TENANT_ID');
    spErr.code = 'SP_AUTH_FAILED';
    spErr.original = err;
    throw spErr;
  }
}

// Force-clear the token cache (e.g. after receiving a 401 from Graph)
function clearTokenCache() {
  cachedToken = null;
  tokenExpiry = null;
}

module.exports = { getGraphToken, clearTokenCache };
