export const loadStatuses = Object.freeze({
  IDLE: "IDLE",
  ERROR: "LOAD_ERROR",
  SUCCESS: "LOAD_SUCCESS",
} as const);

export type LoadStatuses = (typeof loadStatuses)[keyof typeof loadStatuses];
