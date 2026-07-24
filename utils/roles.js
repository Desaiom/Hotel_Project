const ROLES = Object.freeze({
  USER: "user",
  HOST: "host",
  ADMIN: "admin",
});

const getUserRole = (user) => (user && user.role) || ROLES.USER;
const isUserRole = (user) => getUserRole(user) === ROLES.USER;

const isAdmin = (user) => getUserRole(user) === ROLES.ADMIN;

const isHostRole = (user) => getUserRole(user) === ROLES.HOST;

const canManageListings = (user) => isAdmin(user) || isHostRole(user);

module.exports = {
  ROLES,
  getUserRole,
  isAdmin,
  isUserRole,
  isHostRole,
  canManageListings,
};
