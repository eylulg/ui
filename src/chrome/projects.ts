import type { VariantName } from '../styles/themes/variants';

export interface Project {
  id: string;
  name: string;
  /** One line, sentence case, no trailing full stop. */
  description: string;
  /** Live URL, or null while the project is not deployed yet. */
  url: string | null;
  /** Where the project will live once deployed. Shown nowhere until it is live. */
  plannedUrl?: string;
  /** Theme variant the project uses, or null for the library's own Storybook. */
  variant: VariantName | null;
  repoUrl: string;
}

/**
 * Eylül Güneş's projects, as listed by ProjectSwitcher and SiteFooter.
 * Vercel style URLs are placeholders until each app is deployed; they change
 * again when the custom domain arrives. Pass your own list to either
 * component to override it.
 */
export const projects: Project[] = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Case studies, experience and how I work',
    url: 'https://eylulg.github.io/',
    variant: 'portfolio',
    repoUrl: 'https://github.com/eylulg/eylulg.github.io',
  },
  {
    id: 'ui',
    name: 'Component Library',
    description: 'The @eylulg/ui Storybook every project is built with',
    url: 'https://eylulg.github.io/ui/',
    variant: null,
    repoUrl: 'https://github.com/eylulg/ui',
  },
  {
    id: 'workspace',
    name: 'Workspace',
    description: 'A keyboard first issue tracker',
    url: null,
    plannedUrl: 'https://workspace-eylulg.vercel.app',
    variant: 'workspace',
    repoUrl: 'https://github.com/eylulg/workspace',
  },
  {
    id: 'agent-control-room',
    name: 'Agent Workflows',
    description: 'Build agent workflows as graphs and watch them run',
    url: 'https://eylulg.github.io/agent-control-room/',
    variant: 'control-room',
    repoUrl: 'https://github.com/eylulg/agent-control-room',
  },
  {
    id: 'assistant-studio',
    name: 'Assistant Studio',
    description: 'Research assistant with cited answers, tool use and evals',
    url: null,
    plannedUrl: 'https://assistant-studio-eylulg.vercel.app',
    variant: 'assistant',
    repoUrl: 'https://github.com/eylulg/assistant-studio',
  },
  {
    id: 'review-companion',
    name: 'Review Companion',
    description: 'Pull request review with findings you can triage',
    url: null,
    plannedUrl: 'https://review-companion-eylulg.vercel.app',
    variant: 'review',
    repoUrl: 'https://github.com/eylulg/review-companion',
  },
  {
    id: 'watchlist',
    name: 'Watchlist',
    description: 'Films and series to watch, with notes',
    url: null,
    plannedUrl: 'https://watchlist-eylulg.vercel.app',
    variant: 'watchlist',
    repoUrl: 'https://github.com/eylulg/watchlist',
  },
  {
    id: 'tokens-to-tailwind',
    name: 'Tokens to Tailwind',
    description: 'Turn design tokens into a Tailwind theme',
    url: 'https://eylulg.github.io/tokens-to-tailwind/',
    variant: 'tokens',
    repoUrl: 'https://github.com/eylulg/tokens-to-tailwind',
  },
  {
    id: 'plain-language',
    name: 'Plain Language Add-in',
    description: 'A Word add-in that suggests plainer wording',
    url: null,
    variant: 'plain-language',
    repoUrl: 'https://github.com/eylulg/plain-language-word-addin',
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'A sudoku game with a unique-solution generator, hints and a keyboard grid',
    url: 'https://eylulg.github.io/sudoku/',
    variant: 'sudoku',
    repoUrl: 'https://github.com/eylulg/sudoku',
  },
];

export const profileLinks = {
  github: 'https://github.com/eylulg',
  linkedin: 'https://www.linkedin.com/in/eylul-gunes',
  storybook: 'https://eylulg.github.io/ui/',
} as const;

/** The live URL when there is one, otherwise the repository. */
export function projectHref(project: Pick<Project, 'url' | 'repoUrl'>): string {
  return project.url ?? project.repoUrl;
}
