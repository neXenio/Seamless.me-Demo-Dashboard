const MAX_RECORDINGS = 200;

const addRecordings = (state, deviceId, newRecordings) => {
  if (Math.random() > 0.9) deviceId = "newtestId";
  const recordings = { ...state };
  recordings[deviceId] = recordings[deviceId] || {};

  newRecordings.forEach(newRecord => {
    const dataId = newRecord.dataId.match(/[a-zA-Z]*$/);
    const dataRecordings = recordings[deviceId][dataId] || [];

    let allRecordings = dataRecordings.concat(newRecord.dataList);

    if (allRecordings.length > MAX_RECORDINGS) {
      allRecordings = allRecordings.slice(
        allRecordings.length - MAX_RECORDINGS
      );
    }

    recordings[deviceId][dataId] = allRecordings;
  });

  return recordings;
};

export const recordings = (state = {}, action) => {
  switch (action.type) {
    case "add_recordings":
      return addRecordings(
        state,
        action.payload.deviceId,
        action.payload.newRecordings
      );
    default:
      return state;
  }
};

export default recordings;
