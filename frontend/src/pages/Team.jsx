import TeamCard from "../components/TeamCard";
import "./Team.css";

const teamMembers = [
  { name: "Muhammad Fasih", rollNo: "22F-BSCS-19" },
  { name: "Syed Masood Hussain", rollNo: "22F-BSCS-26" },
  { name: "Syed Tehmeed Jafar", rollNo: "22F-BSCS-11" },
];

export default function Team() {
  return (
    <div className="team-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>
            👥 Our <span className="gradient-text">Team</span>
          </h1>
          <p>
            The minds behind the comparative traffic signal optimization
            project.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <TeamCard
              key={i}
              name={member.name}
              rollNo={member.rollNo}
              index={i}
            />
          ))}
        </div>

        <div
          className="team-info glass-card animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="info-row">
            <span className="info-label">Course</span>
            <span className="info-value">Evolutionary Computing</span>
          </div>
          <div className="info-row">
            <span className="info-label">University</span>
            <span className="info-value">
              Dawood University of Engineering & Technology
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Semester</span>
            <span className="info-value">8th (2026)</span>
          </div>
          <div className="info-row">
            <span className="info-label">Project</span>
            <span className="info-value">
              MetaTraffic AI | Comparative Optimization
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
