import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "../lib/utils";

export const ExperienceSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="experience"
      className="scroll-mt-24 py-20 px-4 relative bg-secondary/30 md:py-24"
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold md:mb-12 md:text-4xl">
          My <span className="text-primary">Experience</span>
        </h2>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative w-full overflow-hidden rounded-lg border border-primary/30 bg-card p-5 text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_0_32px_rgba(139,92,246,0.28)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background sm:p-6"
          aria-expanded={isOpen}
          aria-controls="ntt-data-experience"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <span className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <span className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="relative inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-14 sm:w-14">
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-experience-bounce" />
                <ShieldCheck className="relative h-6 w-6 sm:h-7 sm:w-7" />
              </span>

              <span className="min-w-0">
                <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Internship
                </span>
                <span className="block text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  Cybersecurity Intern{" "}
                  <span className="text-primary text-glow">@ NTT DATA</span>
                </span>
                <span className="mt-3 block max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Click to open space for role details, achievements, and
                  project highlights.
                </span>
              </span>
            </span>

            <span className="flex w-fit items-center gap-3 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-300 group-hover:text-primary md:self-center">
              Details
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </span>
          </span>
        </button>

        <div
          id="ntt-data-experience"
          className={cn(
            "grid transition-all duration-500 ease-out",
            isOpen
              ? "grid-rows-[1fr] opacity-100 mt-8"
              : "grid-rows-[0fr] opacity-0 mt-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="gradient-border bg-card p-5 text-left sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="w-fit shrink-0 rounded-full bg-primary/10 p-3 text-primary">
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-3 text-xl font-semibold text-foreground">
                      Description
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Worked with NTT DATA's Information Security team to
                      strengthen organizational security posture through
                      Governance, Risk & Compliance (GRC), threat intelligence,
                      and security audit initiatives. Designed and developed a
                      Threat Intelligence Dashboard using MISP, NVD, and Cisco
                      PSIRT feeds for real-time vulnerability insights,
                      automated reporting, and threat visualization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="gradient-border bg-card p-5 text-left sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="w-fit shrink-0 rounded-full bg-primary/10 p-3 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-3 text-xl font-semibold text-foreground">
                      Projects
                    </h3>
                    <h4 className="mb-3 text-base font-medium text-primary">
                      Threat Intelligence Dashboard
                    </h4>
                    <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
                      <li>
                        Built with React.js, Vite, Node.js, MISP, NVD, and Cisco
                        PSIRT feeds.
                      </li>
                      <li>
                        Integrated MISP API data to visualize vulnerabilities by
                        product and severity in real time.
                      </li>
                      <li>
                        Added TLP color-coded alerts, Excel export, and a
                        timeline view to streamline InfoSec reporting workflows.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
