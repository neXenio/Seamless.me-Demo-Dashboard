export const devices = (state = {}, action) => {
  switch (action.type) {
    case "add_device":
      return {
        ...state,
        [action.payload.device.id]: action.payload.device
      };
    default:
      return state;
  }
};

export default devices;
