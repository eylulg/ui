import type { ReactNode } from 'react';
import { profileLinks, projectHref, projects as defaultProjects, type Project } from './projects';

export interface SiteFooterLabels {
  /** Accessible name of the project links. */
  projectsNav: string;
  /** Accessible name of the profile links. */
  profilesNav: string;
  github: string;
  linkedin: string;
  /** Sentence about where the code lives. */
  codeNote: string;
  /** Link to the component library. */
  builtWith: string;
}

export interface SiteFooterProps {
  /** Overrides the built in project list. */
  projects?: Project[];
  /** id of the project this footer is on; its link is marked as the current site. */
  currentId?: string;
  /** Translated texts. Missing keys keep the English default. Translate project names in `projects`. */
  labels?: Partial<SiteFooterLabels>;
  /** Extra content below the note, such as required attributions. */
  children?: ReactNode;
}

const defaultLabels: SiteFooterLabels = {
  projectsNav: 'Projects',
  profilesNav: 'Profiles',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  codeNote: "Every project's code is on GitHub.",
  builtWith: 'Built with @eylulg/ui',
};

const footer = 'border-t border-default bg-secondary';
const inner = 'mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8';
const row = 'flex flex-wrap items-center justify-between gap-x-6 gap-y-2';
const list = 'flex flex-wrap items-center gap-x-4 gap-y-2';
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
const link = `touch-target relative rounded-xs text-sm text-tertiary underline-offset-4 hover:text-primary hover:underline aria-[current=page]:text-brand ${focus}`;
const note = 'flex flex-wrap gap-x-4 gap-y-1 text-xs text-tertiary';
const noteLink = `rounded-xs underline underline-offset-4 hover:text-primary ${focus}`;
const extra = 'flex flex-col gap-2 text-xs text-tertiary';

/**
 * Footer shared by every project, in one quiet band: links to the projects, GitHub
 * and LinkedIn, a line about the code and the component library. Server safe.
 */
export function SiteFooter({
  projects = defaultProjects,
  currentId,
  labels,
  children,
}: SiteFooterProps) {
  const text = { ...defaultLabels, ...labels };
  return (
    <footer className={footer}>
      <div className={inner}>
        <div className={row}>
          <nav aria-label={text.projectsNav} className='min-w-0 flex-1'>
            <ul className={list}>
              {projects.map((project) => (
                <li key={project.id}>
                  <a
                    href={projectHref(project)}
                    className={link}
                    aria-current={project.id === currentId ? 'page' : undefined}
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className={list} aria-label={text.profilesNav}>
            <li>
              <a href={profileLinks.github} className={link}>
                {text.github}
              </a>
            </li>
            <li>
              <a href={profileLinks.linkedin} className={link}>
                {text.linkedin}
              </a>
            </li>
          </ul>
        </div>
        <p className={note}>
          <span>{text.codeNote}</span>
          <a href={profileLinks.storybook} className={noteLink}>
            {text.builtWith}
          </a>
        </p>
        {children && <div className={extra}>{children}</div>}
      </div>
    </footer>
  );
}
