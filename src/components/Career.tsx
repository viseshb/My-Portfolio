import "./styles/Career.css";

const careerTimeline = [
  {
    role: "Software Engineer",
    company: "Buoyant Software Solutions",
    dates: "Jan 2024 - Dec 2024",
    summary:
      "Designed and delivered ERP backend modules integrating CADMATIC engineering data with relational systems across 16 departments. Improved SQL performance from about 8s to 350ms and built Dockerized CI/CD workflows with testing, rollback support, and release validation.",
  },
  {
    role: "Software Developer",
    company: "Syra Health",
    dates: "Aug 2023 - Jan 2024",
    summary:
      "Developed cloud backend services for real-time ingestion, search, and monitoring in a healthcare platform. Reduced request latency by about 25% through query tuning and endpoint optimization, and automated build and deployment workflows to shorten release cycles.",
  },
  {
    role: "Software Development Intern",
    company: "RADCube",
    dates: "Jan 2023 - Apr 2023",
    summary:
      "Implemented Java backend components using JDBC and built MERN-based prototypes integrating REST APIs and structured data. Strengthened hands-on experience in object-oriented design, API integration, and collaborative engineering delivery.",
  },
];

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {careerTimeline.map((item) => (
            <div className="career-info-box" key={`${item.role}-${item.dates}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                  <span className="career-date">{item.dates}</span>
                </div>
              </div>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
