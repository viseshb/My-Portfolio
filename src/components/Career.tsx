import "./styles/Career.css";

const careerTimeline = [
  {
    role: "Software Engineer",
    company: "Thermal Systems (Hyderabad) Pvt. Ltd.",
    dates: "Jan 2024 - Dec 2024",
    summary:
      "Cut SQL latency from 8s to 350ms on PostgreSQL serving 850K+ records/day across 16 departments. Improved ML model-serving API throughput 45% with Docker, Redis caching, and CI/CD via GitHub Actions. Zero Sev-1 incidents over 12 months using ELK stack, Kubernetes, and Kafka.",
  },
 {
    role: "Software Developer – AI & Data Platforms",
    company: "Syra Health",
    dates: "Aug 2023 - Jan 2024",
    summary:
      "Built real-time healthcare data pipelines using Kafka, PostgreSQL, and Elasticsearch, exposing data through GraphQL APIs to power predictive models for health risk assessment and fraud detection. Reduced API latency 25% and increased user engagement 20% with React dashboards.",
  },
  {
    role: "Software Development Intern",
    company: "RADcube",
    dates: "Jan 2023 - Apr 2023",
    summary:
      "Cut development time 25% by building modular Java backend services with Spring Boot and designing REST APIs with clean separation of concerns. Developed MERN-based components to support end-to-end data flow across the platform.",
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
