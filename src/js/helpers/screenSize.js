export function getCurrentScreenSize(): ScreenDimensionsType {
  const { documentElement } = document;

  return {
    width: documentElement ? documentElement.clientWidth : 0,
    height: documentElement ? documentElement.clientHeight : 0
  };
}

export const determineChartWidth = (size) => {
  const { width } = getCurrentScreenSize();
  const contentWidth = width - (2 * 30) // content padding

  return ({
    full: contentWidth,
    half: contentWidth / 2,
    third: contentWidth / 3
  }[size]);
}
