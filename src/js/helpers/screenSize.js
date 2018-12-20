export function getCurrentScreenSize(): ScreenDimensionsType {
  const { documentElement } = document;

  return {
    width: documentElement ? documentElement.clientWidth : 0,
    height: documentElement ? documentElement.clientHeight : 0
  };
}
