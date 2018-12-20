const MAX_RECORDINGS = 100;

const addRecordings = (state, deviceId, newRecordings) => {
  const recordings = { ...state };
  recordings[deviceId] = recordings[deviceId] || {};

  newRecordings.forEach(newRecord => {
    console.log("newRecord", newRecord);
    const dataId = newRecord.dataId;
    let dataRecordings = recordings[deviceId][dataId] || [];

    dataRecordings = dataRecordings
      .concat(newRecord.dataList)
      .slice(Math.max(dataRecordings.length - MAX_RECORDINGS, 0));
    recordings[deviceId][dataId] = dataRecordings;
  });

  return recordings;
};

export const recordings = (state = [], action) => {
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
