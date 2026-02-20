export const logInfo = (message, meta = {}) => {
  console.log(`[INFO] ${message}`, meta);
};

export const logError = (message, meta = {}) => {
  console.error(`[ERROR] ${message}`, meta);
};
