import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let isIconsHover = false;
    let rafId = 0;
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursorPos = { x: mousePos.x, y: mousePos.y };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const animate = () => {
      if (!isIconsHover) {
        cursorPos.x += (mousePos.x - cursorPos.x) / 6;
        cursorPos.y += (mousePos.y - cursorPos.y) / 6;
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onMouseOver = (e: Event) => {
      const element = e.currentTarget as HTMLElement;
      if (!element || !element.dataset.cursor) return;

      if (element.dataset.cursor === "icons") {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        isIconsHover = true;
        cursor.classList.add("cursor-icons");
        cursor.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
      }

      if (element.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      isIconsHover = false;
    };

    const trackedElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor]")
    );

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    trackedElements.forEach((element) => {
      element.addEventListener("mouseover", onMouseOver);
      element.addEventListener("mouseout", onMouseOut);
    });
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      trackedElements.forEach((element) => {
        element.removeEventListener("mouseover", onMouseOver);
        element.removeEventListener("mouseout", onMouseOut);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
