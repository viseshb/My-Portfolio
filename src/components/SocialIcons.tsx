import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { withBasePath } from "../utils/basePath";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const items = Array.from(social.querySelectorAll<HTMLElement>("span"));
    const links = items
      .map((item) => item.querySelector<HTMLElement>("a"))
      .filter((link): link is HTMLElement => Boolean(link));
    if (!items.length || !links.length) return;

    const state = links.map(() => ({
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      width: 0,
      height: 0,
    }));

    const setCenter = (index: number) => {
      state[index].targetX = state[index].width / 2;
      state[index].targetY = state[index].height / 2;
      if (!state[index].currentX && !state[index].currentY) {
        state[index].currentX = state[index].targetX;
        state[index].currentY = state[index].targetY;
      }
    };

    const updateRects = () => {
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        state[index].width = rect.width;
        state[index].height = rect.height;
        setCenter(index);
      });
    };

    let rafId = 0;
    const onMouseMove = (e: MouseEvent) => {
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          state[index].targetX = x;
          state[index].targetY = y;
          return;
        }
        setCenter(index);
      });
    };

    const animate = () => {
      state.forEach((item, index) => {
        item.currentX += (item.targetX - item.currentX) * 0.1;
        item.currentY += (item.targetY - item.currentY) * 0.1;
        links[index].style.setProperty("--siLeft", `${item.currentX}px`);
        links[index].style.setProperty("--siTop", `${item.currentY}px`);
      });
      rafId = requestAnimationFrame(animate);
    };

    updateRects();
    animate();
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", updateRects);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateRects);
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/viseshb" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/viseshb" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/visesh_visu/" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href={withBasePath("resume/Visesh_Bentula_Resume.pdf")}
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
