export const addRecordings = (deviceId, newRecordings) => ({
  type: "add_recordings",
  payload: { deviceId, newRecordings }
});

export const addDevice = device => ({
  type: "add_device",
  payload: { device }
});

export const selectDevice = deviceId => ({
  type: "select_device",
  payload: { deviceId }
});

export const selectFeature = feature => ({
  type: "select_feature",
  payload: { feature }
});

export const deselectFeature = () => ({
  type: "deselect_feature"
});
