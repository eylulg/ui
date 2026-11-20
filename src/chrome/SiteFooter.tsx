import { useId, type ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';
import { profileLinks, projects as defaultProjects, type Project } from './projects';

export interface SiteFooterLabels {
  /** Line next to the mark. */
  intro: string;
  /** Accessible name of the project links. */
  projectsNav: string;
  /** Heading of the group of live projects. */
  live: string;
  /** Heading of the group of repositories. */
  code: string;
  /**
   * @deprecated No longer shown. Projects without a live site appear under the code group only.
   */
  source?: string;
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
  live: 'Live',
  code: 'Code',
  profilesNav: 'Profiles',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  builtWith: 'Built with @eylulg/ui',
};

const footer = 'border-t border-default bg-secondary';
const inner = 'mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8';
const intro = 'flex items-center gap-2 text-sm text-secondary';
const list = 'flex flex-wrap gap-x-5 gap-y-2';
const groups = 'grid gap-6 md:grid-cols-2';
const groupLabel = 'mb-2 text-xs font-medium text-secondary';
const link =
  'touch-target relative rounded-xs text-sm text-tertiary underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
const extra = 'flex flex-col gap-2 text-xs text-tertiary';
const bottom =
  'flex flex-col gap-3 border-t border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between';

/**
 * Footer shared by every project: who made it, the projects that are live, every
 * repository, GitHub and LinkedIn, and the component library. Server safe.
 */
export function SiteFooter({
  projects = defaultProjects,
  currentId,
  labels,
  children,
}: SiteFooterProps) {
  const id = useId();
  const text = { ...defaultLabels, ...labels };
  return (
    <footer className={footer}>
      <div className={inner}>
        <p className={intro}>
          <BrandLogo size={24} />
          {text.intro}
        </p>
        <nav aria-label={text.projectsNav} className={groups}>
          <div>
            <p id={`${id}-live`} className={groupLabel}>
              {text.live}
            </p>
            <ul className={list} aria-labelledby={`${id}-live`}>
              {projects.map(
                (project) =>
                  project.url && (
                    <li key={project.id}>
                      <a
                        href={project.url}
                        className={link}
                        aria-current={project.id === currentId ? 'page' : undefined}
                      >
                        {project.name}
                      </a>
                    </li>
                  ),
              )}
            </ul>
          </div>
          <div>
            <p id={`${id}-code`} className={groupLabel}>
              {text.code}
            </p>
            <ul className={list} aria-labelledby={`${id}-code`}>
              {projects.map((project) => (
                <li key={project.id}>
                  <a
                    href={project.repoUrl}
                    className={link}
                    aria-label={`${project.name} ${text.code}`}
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
