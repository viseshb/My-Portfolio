import { lazy, Suspense, useEffect, useRef, useState } from "react";

const loadTechStack = () => import("./TechStack");
const TechStack = lazy(loadTechStack);

const TechStackFallback = () => {
  return (
    <div className="techstack techstack-placeholder" aria-hidden="true">
      <h2> My Techstack</h2>
    </div>
  );
};

const DeferredTechStack = () => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      {
        rootMargin: "1200px 0px",
      }
    );

    observer.observe(marker);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div ref={markerRef}>
      {shouldLoad ? (
        <Suspense fallback={<TechStackFallback />}>
          <TechStack />
        </Suspense>
      ) : (
        <TechStackFallback />
      )}
    </div>
  );
};

export default DeferredTechStack;
