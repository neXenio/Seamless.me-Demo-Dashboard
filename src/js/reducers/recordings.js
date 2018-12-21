const MAX_RECORDINGS = 1000;
const MAX_DISPLAED_MILLIES = 30000;

const addRecordings = (state, deviceId, newRecordings) => {
  deviceId = "BlackBerry Key One";
  const recordings = { ...state };
  recordings[deviceId] = recordings[deviceId] || {};

  newRecordings.forEach(newRecord => {
    const dataId = newRecord.dataId
      .match(/[a-zA-Z]*$/)[0]
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace("Rx ", "");
    const dataRecordings = recordings[deviceId][dataId] || [];

    let allRecordings = dataRecordings
      .concat(newRecord.dataList)
      .filter(
        record =>
          record.aggregationTimestamp + MAX_DISPLAED_MILLIES > Date.now()
      );

    // if (allRecordings.length > MAX_RECORDINGS) {
    //   allRecordings = allRecordings.slice(
    //     allRecordings.length - MAX_RECORDINGS
    //   );
    // }

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
