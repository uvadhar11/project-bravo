import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { GraduationCap, Briefcase, Code } from "lucide-react";

const teamMembers = [
    {
    name: "Umang Vadhar",
    role: "Lead Programmer",
    education: "x",
    skills: ["x", "x", "x", "x"],
    experience:
      "x",
  },
  {
    name: "Alex Barnett",
    role: "Project Manager",
    education: "Associates in Computer Science (2024)",
    skills: ["Java", "JavaScript", "Python"],
    experience:
      "3 Years being an IT Technician",
  },
  {
    name: "Beng Duong",
    role: "UI/UX Designer",
    education: "BS in Computer Science (2028)",
    skills: ["Java", "Python", "HTML", "CSS", "JavaScript", "Swift", "Assembly"],
    experience:
      "Caltrans Software Development Student Intern (  September 2025 - Present) | OptionThreeTechLLC Co-Founder & Software Engineer(March  2025 - Present) ",
  },
  {
    name: "Derian Godoy-Chavez",
    role: "Backend Programmer",
    education: "Sacramento State Computer Science(2028)",
    skills: ["Python", "C", "Java", "Supabase"],
    experience:
      "2 years of data science experience and backend development",
  },
  {
    name: "Mukhammad Abdusamadov",
    role: "QC",
    education: "Associates in Computer Science (2024)",
    skills: ["C", "C++", "Python", "Assembly"],
    experience:
      "2 years in robotics",
  },
  {
    name: "Mohsin Mohammad",
    role: "Programmer",
    education: "Sacramento State University (second year student)",
    skills: ["Java", "C++", "Python", "SQL", "Assembly", "Data Science & Machine Learning", "HTML", "CSS", "Microsoft 365 fundamentals(involved)", "Microsoft Azure(involved)"],
    experience:
      "Private Mathematics Tutor (Feb 2021 - Jan 2022), April 18 Hackathon (April 18, 2025)",
  },
  {
    name: "Ronald Salas",
    role: "Designer",
    education: "Sacramento State University (second year student)",
    skills: ["Java", "C++", "Python", "Data & AI: Assembly"],
    experience:
      "Bilingual learning and teaching (2017), Napa Valley College Mentor Collective (2023): ",
  },
  {
    name: "Sparsh Saraiya",
    role: "Lead Analyst/Lead QC",
    education: "Sacramento State University (junior)",
    skills: ["Cybersecurity", "Penetration testing", "Threat analysis", "Network security", "Linux administration", "Secure software development"],
    experience:
      "Strong background in cybersecurity with experience in security auditing, vulnerability assessment, and secure systems practices. Works as a freelance cybersecurity consultant supporting small organizations with security evaluations and improvements. Recognized by the State of California for biliteracy and certified by CompTIA with Security+.",
  },

];

export function About() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-slate-900">About Our Team</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Meet the talented individuals behind Expense Tracker. Our diverse team
          brings together expertise in development, design, and project
          management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-slate-900">{member.name}</h3>
              <p className="text-slate-600">{member.role}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700">Education</p>
                  <p className="text-slate-600">{member.education}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Code className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-700">Experience</p>
                  <p className="text-slate-600">{member.experience}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
