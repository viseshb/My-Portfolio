import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { withBasePath } from "../utils/basePath";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const links = document.querySelectorAll<HTMLAnchorElement>(".header ul a");
    const clickHandlers = new Map<
      HTMLAnchorElement,
      (e: MouseEvent) => void
    >();

    links.forEach((element) => {
      const onClick = (e: MouseEvent) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      };
      clickHandlers.set(element, onClick);
      element.addEventListener("click", onClick);
    });

    const onResize = () => {
      ScrollSmoother.refresh(true);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clickHandlers.forEach((handler, element) => {
        element.removeEventListener("click", handler);
      });
      window.removeEventListener("resize", onResize);
      smoother?.kill();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href={withBasePath("")} className="navbar-title" data-cursor="disable">
          VB
        </a>
        <a
          href="mailto:visesh66@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          visesh66@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#skills" href="#skills">
              <HoverLinks text="SKILLS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
