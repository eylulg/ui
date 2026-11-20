import type { ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';
import { profileLinks, projectHref, projects as defaultProjects, type Project } from './projects';

export interface SiteFooterLabels {
  /** Line next to the mark. */
  intro: string;
  /** Accessible name of the project links. */
  projectsNav: string;
  /** Added after the name of a project that links to its source code. */
  source: string;
  /** Accessible name of the profile links. */
  profilesNav: string;
  github: string;
  linkedin: string;
  /** Link to the component library. */
  builtWith: string;
}

export interface SiteFooterProps {
  /** Overrides the built in project list. */
  projects?: Project[];
  /** id of the project this footer is on; its link is marked as the current site. */
  currentId?: string;
  /** Translated texts. Missing keys keep the English default. Translate project descriptions in `projects`. */
  labels?: Partial<SiteFooterLabels>;
  /** Extra content between the project links and the profile row, such as required attributions or more links. */
  children?: ReactNode;
}

const defaultLabels: SiteFooterLabels = {
  intro: "Part of Eylül Güneş's projects",
  projectsNav: 'Projects',
  source: '(source)',
  profilesNav: 'Profiles',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  builtWith: 'Built with @eylulg/ui',
};

const footer = 'border-t border-default bg-secondary';
const inner = 'mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8';
const intro = 'flex items-center gap-2 text-sm text-secondary';
const list = 'flex flex-wrap gap-x-5 gap-y-2';
const link =
  'rounded-xs text-sm text-tertiary underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
const sourceNote = 'text-xs text-tertiary';
const extra = 'flex flex-col gap-2 text-xs text-tertiary';
const bottom =
  'flex flex-col gap-3 border-t border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between';

/**
 * Footer shared by every project: who made it, links to the other projects,
 * GitHub and LinkedIn, and the component library. No hooks, server safe.
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
        <p className={intro}>
          <BrandLogo size={24} />
          {text.intro}
        </p>
        <nav aria-label={text.projectsNav}>
          <ul className={list}>
            {projects.map((project) => (
              <li key={project.id}>
                <a
                  href={projectHref(project)}
                  className={link}
                  aria-current={project.id === currentId ? 'page' : undefined}
                >
                  {project.url ? project.name : `${project.name} `}
                  {!project.url && <span className={sourceNote}>{text.source}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {children && <div className={extra}>{children}</div>}
        <div className={bottom}>
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
          <a href={profileLinks.storybook} className={link}>
            {text.builtWith}
          </a>
        </div>
      </div>
    </footer>
  );
}
