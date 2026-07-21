import "./styles/Career.css";

const careerTimeline = [
  {
    role: "Software Development Intern",
    company: "Digifyde",
    dates: "Jun 2026 - Present",
    summary:
      "Built Orion's Agent Harness to centralize LLM agents, prompts, tools, and workflows across AI-powered features. Added Orion data mapping plus PII redaction and filtering guardrails with role-based access control to keep sensitive client data away from external LLMs. Built full-stack AI features across PostgreSQL and MongoDB using a Bronze/Silver/Gold medallion pipeline, while partnering with clients to refine prompts and improve generated results.",
  },
  {
    role: "Software Engineer",
    company: "Thermal Systems",
    dates: "Jan 2024 - Dec 2024",
    summary:
      "Reduced ERP reporting latency across 16 departments from 8 seconds to 350 milliseconds over 850K+ daily records by optimizing PostgreSQL execution plans, indexes, joins, partitions, and Redis caching. Increased production ML inference API throughput 45% with Docker on AWS, Redis, input batching, and horizontal scaling. Reduced Sev-1 recovery time for Kafka microservices from 4 hours to under 30 minutes with Prometheus, Grafana, ELK, Kubernetes health checks, and recovery workflows.",
  },
  {
    role: "Software Developer - AI & Data Platforms",
    company: "Syra Health",
    dates: "Aug 2023 - Jan 2024",
    summary:
      "Built real-time healthcare data pipelines using Kafka, PostgreSQL, Elasticsearch, and GraphQL for risk-assessment and fraud-detection models supporting 220K+ users. Reduced release time 40% with GitHub Actions and Docker CI/CD, zero-downtime deployments, and automated rollbacks; React dashboards increased user engagement 20%.",
  },
];

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&amp;</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline" aria-hidden="true">
            <div className="career-dot"></div>
          </div>
          {careerTimeline.map((item) => (
            <div className="career-info-box" key={`${item.role}-${item.dates}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h3>{item.role}</h3>
                  <h4>{item.company}</h4>
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
