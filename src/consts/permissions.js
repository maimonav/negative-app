export const permissions = [
  { title: "ADMIN" },
  { title: "MANAGER" },
  { title: "DEPUTY MANAGER" },
  { title: "SHIFT MANAGER" },
  { title: "EMPLOYEE" }
];

export const permissionsObj = Object.freeze({
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  DEPUTY_MANAGER: "DEPUTY MANAGER",
  SHIFT_MANAGER: "SHIFT MANAGER",
  EMPLOYEE: "EMPLOYEE"
});

export const isAtLeastEmployee = permission =>
  permission === permissionsObj.EMPLOYEE ||
  permission === permissionsObj.SHIFT_MANAGER ||
  permission === permissionsObj.DEPUTY_MANAGER ||
  permission === permissionsObj.MANAGER ||
  permission === permissionsObj.ADMIN;

export const isAtLeastShiftManager = permission =>
  permission === permissionsObj.SHIFT_MANAGER ||
  permission === permissionsObj.DEPUTY_MANAGER ||
  permission === permissionsObj.MANAGER ||
  permission === permissionsObj.ADMIN;

export const isAtLeastDeputyManager = permission =>
  permission === permissionsObj.DEPUTY_MANAGER ||
  permission === permissionsObj.MANAGER ||
  permission === permissionsObj.ADMIN;

export const isAtLeastManager = permission =>
  permission === permissionsObj.MANAGER || permission === permissionsObj.ADMIN;

export const isAdmin = permission => permission === permissionsObj.ADMIN;
