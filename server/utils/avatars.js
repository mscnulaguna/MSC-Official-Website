// Avatar presets available for users
// Base URL from env so this works in production too
const BASE_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const AVATAR_PRESETS = Array.from({ length: 12 }, (_, i) => ({
  id: `avatar-${i + 1}`,
  name: `Avatar ${i + 1}`,
  path: `${BASE_URL}/avatars/avatar-${i + 1}.svg`,
}));

module.exports = { AVATAR_PRESETS };

module.exports = { AVATAR_PRESETS };
