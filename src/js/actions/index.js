export const addRecordings = (deviceId, newRecordings) => ({
  type: "add_recordings",
  payload: { deviceId, newRecordings }
});

export const addDevice = device => ({
  type: "add_device",
  payload: { device }
});
