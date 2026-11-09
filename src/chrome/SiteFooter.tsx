import { BrandMark } from './BrandMark';
import { profileLinks, projectHref, projects as defaultProjects, type Project } from './projects';

export interface SiteFooterProps {
  /** Overrides the built in project list. */
  projects?: Project[];
  /** id of the project this footer is on; its link is marked as the current site. */
  currentId?: string;
}

const footer = 'border-t border-subtle bg-secondary';
const inner = 'mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8';
const intro = 'flex items-center gap-2 text-sm text-secondary';
const list = 'flex flex-wrap gap-x-5 gap-y-2';
const link =
  'rounded-xs text-sm text-tertiary underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
const sourceNote = 'text-xs text-tertiary';
const bottom =
  'flex flex-col gap-3 border-t border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between';

/**
 * Footer shared by every project: who made it, links to the other projects,
 * GitHub and LinkedIn, and the component library. No hooks, server safe.
 */
export function SiteFooter({ projects = defaultProjects, currentId }: SiteFooterProps) {
  return (
    <footer className={footer}>
      <div className={inner}>
        <p className={intro}>
          <BrandMark size={20} />
          Part of Eylül Güneş&apos;s projects
        </p>
        <nav aria-label="Projects">
          <ul className={list}>
            {projects.map((project) => (
              <li key={project.id}>
                <a
                  href={projectHref(project)}
                  className={link}
                  aria-current={project.id === currentId ? 'page' : undefined}
                >
                  {project.url ? project.name : `${project.name} `}
                  {!project.url && <span className={sourceNote}>(source)</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={bottom}>
          <ul className={list} aria-label="Profiles">
            <li>
              <a href={profileLinks.github} className={link}>
                GitHub
              </a>
            </li>
            <li>
              <a href={profileLinks.linkedin} className={link}>
                LinkedIn
              </a>
            </li>
          </ul>
          <a href={profileLinks.storybook} className={link}>
            Built with @eylulg/ui
          </a>
        </div>
      </div>
    </footer>
  );
}
