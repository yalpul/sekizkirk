import { cellColors } from "./colors";

export const getContext = (coursesData) => {
  const context = {};

  coursesData.forEach(({ name, slots }, index) => {
    const bgColor = cellColors[index];

    slots.forEach(({ hourIndex, dayIndex }) => {
      const placeholderName = `${hourIndex}-${dayIndex}`;
      context[placeholderName] = name;
      context[`bg${placeholderName}`] = bgColor;
    });
  });

  return context;
};
