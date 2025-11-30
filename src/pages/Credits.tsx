import { Card } from "../components/ui/card";
import { CheckCircle2 } from "lucide-react";

const contributions = [
  {
    name: "Umang Vadhar",
    role: "Lead Programmer",
    contributions: [
      "x",
      "x",
      "x",
      "x",
    ],
  },
  {
    name: "Alex Barnett",
    role: "Project Manager",
    contributions: [
      "Define Requirements – Gather and clarify functional and non-functional requirements with the team.",
      "Task Planning – Break the project into tasks, create timelines, and assign work to developers.",
      "Track Development Progress – Monitor code progress, testing, and integration; resolve blockers and manage risks.",
      "Facilitate Communication – Coordinate between developers, designers, and QA to ensure everyone stays aligned. ",
    ],
	image: "/team/alex.png",
  },

  {
    name: "Beng Duong",
    role: "UI/UX Designer",
    contributions: [
      "Created the full website wireframe, outlining the structure and user flow.",
      "Designed and coded the front-end for all pages, including layout, styling, and user interface elements.",
      "Reviewed all project documentation before submission to ensure accuracy and completeness.",
      "Assisted in testing and refining the website to ensure proper functionality and usability.",
    ],
	image: "/team/ben.png",
  },
  {
    name: "Derian Godoy-Chavez",
    role: "Backend Programmer",
    contributions: [
      "Worked on initial class setups",
      "Developed the transaction methods",
      "Helped setup the database",
      "Reviewed documentation to ensure accuracy",
    ],
	image: "/team/derian.png",
  },
  {
    name: "Mukhammad Abdusamadov",
    role: "QC",
    contributions: [
      "Created and managed social media accounts",
      "Helped Sparsh with test cases documentation",
      "Updated about/credits page",
      "Tested the website to discover edge cases",
    ],
	image: "/team/mukhammad.jpg",
  },
  {
    name: "Mohsin Mohammad",
    role: "Programmer",
    contributions: [
      "Set up the supabase, wrote down the chart.js graph drafts as well as the admin class draft",
      "Helped Derian with the person class draft, and worked with Derian to make sure the code follows the software documents",
      "Created the zoom meetings and participated in discussion by asking questions.",
      "Always asked Derian if there was more stuff I could do to help in order to contribute.",
    ],
	image: "/team/mohsin.png",
  },
  {
    name: "Ronald Salas",
    role: "Designer",
    contributions: [
      "Designed and maintained UML diagrams",
      "Designed and maintained Algorithm diagrams",
      "Designed and maintained Use-case diagrams",
    ],
	image: "/team/ronald.jpg",
  },
  {
    name: "Sparsh Saraiya",
    role: "Lead Analyst/Lead QC",
    contributions: [
      "Led requirement analysis and contributed extensively to all major project deliverables, including system design, testing, and software evolution.",
      "Oversaw the planning, writing, and refinement of the project’s documentation as a whole.",
      "Developed most of the test cases to ensure full compliance with system requirements.",
    ],
	image: "/team/sparsh.png",
  },
];

export function Credits() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-slate-900">Project Credits</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Recognizing the individual contributions that made this project
          possible. Each team member played a crucial role in bringing Expense
          Tracker to life.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contributions.map((person, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
		<img
		  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-slate-900">{person.name}</h3>
                <p className="text-slate-600">{person.role}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-700">Contributions:</p>
              <ul className="space-y-2">
                {person.contributions.map((contribution, contribIndex) => (
                  <li key={contribIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
