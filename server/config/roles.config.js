// Define all role types in the system
const roles = {
  PUBLIC: 'public',
  MEMBER: 'member',
  OFFICER: 'officer',
  ADMIN: 'admin'
};

// Define role hierarchy levels (higher = more permissions)
const roleHierarchy = {
  [roles.ADMIN]: 4,
  [roles.OFFICER]: 3,
  [roles.MEMBER]: 2,
  [roles.PUBLIC]: 1
};

// Map API endpoints/actions to allowed roles
const endpointPermissions = {
  // Authentication - everyone can register/login
  'AUTH_REGISTER_LOGIN': [roles.PUBLIC, roles.MEMBER, roles.OFFICER, roles.ADMIN],

  // Public data - everyone can read
  'GET_EVENTS': [roles.PUBLIC, roles.MEMBER, roles.OFFICER, roles.ADMIN],
  'GET_GUILDS': [roles.PUBLIC, roles.MEMBER, roles.OFFICER, roles.ADMIN],
  'GET_PARTNERS': [roles.PUBLIC, roles.MEMBER, roles.OFFICER, roles.ADMIN],
  'GET_ANNOUNCEMENTS': [roles.PUBLIC, roles.MEMBER, roles.OFFICER, roles.ADMIN],

  // Event registration - members only
  'POST_EVENT_REGISTER': [roles.MEMBER, roles.OFFICER, roles.ADMIN],

  // Guild resources - members only
  'GET_GUILD_RESOURCES': [roles.MEMBER, roles.OFFICER, roles.ADMIN],

  // Guild application - members only
  'POST_GUILD_APPLY': [roles.MEMBER, roles.OFFICER, roles.ADMIN],

  // Event management - officers and admins
  'POST_EVENT': [roles.OFFICER, roles.ADMIN],
  'PATCH_EVENT': [roles.OFFICER, roles.ADMIN],
  'DELETE_EVENT': [roles.OFFICER, roles.ADMIN],

  // Attendance scanning - officers and admins
  'MANAGE_ATTENDANCE_SCAN': [roles.OFFICER, roles.ADMIN],

  // Announcement creation - officers and admins
  'POST_ANNOUNCEMENT': [roles.OFFICER, roles.ADMIN],

  // Admin-only management
  'MANAGE_USERS': [roles.ADMIN],
  'MANAGE_PARTNERS': [roles.ADMIN],
  'MANAGE_GUILDS': [roles.ADMIN]
};

// Check if user has permission for specific action
function hasPermission(userRole, requiredPermission) {
  const allowedRoles = endpointPermissions[requiredPermission];
  
  if (!allowedRoles) {
    console.warn(`Unknown permission: ${requiredPermission}`);
    return false;
  }

  return allowedRoles.includes(userRole);
}

// Get all roles meeting or exceeding minimum level
function getRolesWithMinimum(minRole) {
  const minLevel = roleHierarchy[minRole];
  
  if (!minLevel) {
    return [];
  }

  return Object.entries(roleHierarchy)
    .filter(([, level]) => level >= minLevel)
    .map(([role]) => role);
}

// Check if user's role meets minimum requirement
function meetsMinimumRole(userRole, minRole) {
  const userLevel = roleHierarchy[userRole];
  const minLevel = roleHierarchy[minRole];

  if (!userLevel || !minLevel) {
    return false;
  }

  return userLevel >= minLevel;
}

// Export role configuration and helper functions
module.exports = {
  roles,
  roleHierarchy,
  endpointPermissions,
  hasPermission,
  getRolesWithMinimum,
  meetsMinimumRole
};
