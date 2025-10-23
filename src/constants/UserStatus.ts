export const UserStattus = {
  ACTIVE: "Active",
  Banned: "Banned",
} as const;

export type UserStattus = (typeof UserStattus)[keyof typeof UserStattus];
