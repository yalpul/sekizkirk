import { cellColors } from "./colors";

export const getContext = (coursesData) => {
  const context = {};

  coursesData.forEach(
    ({ name, slot: { hourIndex, dayIndex }, courseIndex }) => {
      const bgColor = cellColors[courseIndex];

      const placeholderName = `${hourIndex}-${dayIndex}`;
      context[placeholderName] = name;
      context[`bg${placeholderName}`] = bgColor;
    }
  );

  return context;
};
