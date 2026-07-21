import type { ScrollSmoother } from "gsap/ScrollSmoother";

export let smoother: ScrollSmoother | null = null;

export const setSmoother = (instance: ScrollSmoother | null) => {
  smoother = instance;
};
