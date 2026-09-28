export const apiResponse = {
  success: (res, { message = 'Success', data = undefined, status = 200 } = {}) => {
    const payload = { success: true, message };
    if (data !== undefined) payload.data = data;
    return res.status(status).json(payload);
  },

  error: (res, { message = 'Error', status = 500, details = undefined } = {}) => {
    const payload = { success: false, message };
    if (details !== undefined) payload.details = details;
    return res.status(status).json(payload);
  },
};

