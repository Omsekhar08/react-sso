// OAuth configuration
const clientId = 'xyiIjgLXpOSWMXsCuCGJwdMpnGpSlonP';
const clientSecret = 'sQAUzYjMsdLPJuMMnVJIWjlGZuAPZkEf';
const redirectUri = 'http://localhost:3000/';
const authorizationEndpoint = 'https://hysteresis.gokulkumar.com/wp-json/moserver/authorize';
const tokenEndpoint = 'https://hysteresis.gokulkumar.com/wp-json/moserver/token';
// const userDetailsEndpoint = 'https://hysteresis.gokulkumar.com/wp-json/custom/v1/user';
const scope = 'openid profile email';

export const initiateOAuthLogin = () => {
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('oauth_state', state);
  const url = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
  window.location.href = url;
};

export const exchangeCodeForToken = async (code, state) => {
  const storedState = localStorage.getItem('oauth_state');
  if (state !== storedState) {
    throw new Error('Invalid state parameter');
  }
  localStorage.removeItem('oauth_state');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

export const fetchUserDetails = async () => {
    try {
      const response = await fetch('https://hysteresis.gokulkumar.com/wp-json/custom/v1/user');
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch user details: ${errorData.message || response.statusText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

export const logout = () => {
  localStorage.removeItem('token');
};