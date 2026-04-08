import { useState, useCallback, useEffect, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { withBasePath } from "../utils/basePath";

const projects = [
  {
    id: "context-ai",
    number: "01",
    title: "Context-Aware AI Assistant",
    subtitle: "Developer Intelligence Platform",
    tools: "Python, MCP, LLMs, FastAPI, Postgres, GitHub, Slack",
    image: withBasePath("projects/context-ai-assistant.png"),
    link: "https://github.com/viseshb/context-aware-ai-assistant",
  },
  {
    id: "flood-segmentation",
    number: "02",
    title: "Flood Semantic Segmentation",
    subtitle: "Deep Learning Computer Vision System",
    tools: "Python, PyTorch, U-Net, CUDA, ONNX, FastAPI",
    image: withBasePath("projects/flood-segmentation.png"),
    link: "https://github.com/viseshb/flood-semantic-segmentation",
  },
  {
    id: "effibench-analysis",
    number: "03",
    title: "EffiBench Code Analysis",
    subtitle: "Human vs LLM Algorithm Benchmarking",
    tools: "Python, EffiBench, Benchmarking, Runtime Analysis",
    image: withBasePath("projects/effibench-analysis.png"),
    link: "https://github.com/viseshb/Analyzing_Binary_Search_Problem_Solutions_Comparing_Human_vs_LLM_generated_Code_Using_EffiBench",
  },
];

const Work = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          setCurrentIndex(0);
          setIsAnimating(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div ref={sectionRef} className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project) => (
                <div className="carousel-slide" key={project.id}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>{project.number}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.subtitle}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
