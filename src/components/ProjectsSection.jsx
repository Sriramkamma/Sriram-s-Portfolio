import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "music-streaming-website",
    description: "A full-stack music streaming web application built using the MERN stack. Features include user authentication, playlist management, song uploads, and responsive UI design with smooth user experience..",
    image: "/Projects/Project1.png",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "MERN" ],
    demoUrl: "https://github.com/Sriramkamma/mern-music-streaming-website.git",
    githubUrl: "https://github.com/Sriramkamma/mern-music-streaming-website.git",
  },
{
  id: 2,
  title: "Carrer Assistant",
  description: "An intelligent career guidance platform that helps students explore career paths, skill requirements, and learning resources. Built with a dynamic dashboard and structured backend for efficient data handling..",
  image: "/Projects/Project2.png",
  tags: ["React", "Node.js", "Express.js", "MongoDB"],
  demoUrl: "https://github.com/Sriramkamma/Carrer_assistant.git",
  githubUrl: "https://github.com/Sriramkamma/Carrer_assistant.git",
},
{
  id: 3,
  title: "Handloom",
  description: "An e-commerce web application focused on promoting local handloom brands. Includes product listings, category filtering, modern UI design, and scalable architecture for supporting small businesses.",
  image: "/Projects/Project3.png",
  tags: ["Next.js", "React", "TailwindCSS", "MongoDB"],
  demoUrl: "https://github.com/Sriramkamma/Handloom.git",
  githubUrl: "https://github.com/Sriramkamma/Handloom.git",
}
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary">Projects</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {projects.map((project, key) => (
    <div
      key={key}
      className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
  <div className="flex flex-wrap gap-2 mb-4">
    {project.tags.map((tag) => (
      <span className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
        {tag}
      </span>
    ))}
  </div>
  <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
  <div className="flex justify-between items-center">
    <div className="flex space-x-3">
<a href={project.demoUrl}
target="_blank"
className="text-foreground/80 hover:text-primary transition-colors duration-300"
> 
<ExternalLink size={20}/></a>
<a href={project.githubUrl}
target="_blank"
className="text-foreground/80 hover:text-primary transition-colors duration-300"
> 
<Github size={20}/></a>

</div>
    </div>
</div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
};