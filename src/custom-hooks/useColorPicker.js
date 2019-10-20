import { useState } from "react";

export const useColorPicker = initialState => {
  const [colors, setColors] = useState(initialState);

  return [
    colors,
    propName => ({ hex }) =>
      setColors(prevState => ({
        ...prevState,
        [propName]: hex
      }))
  ];
};
