import { Check, ChevronDown, LayoutGrid } from 'lucide-react';
import { Button } from '../components/Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
} from '../components/DropdownMenu/DropdownMenu';
import { projectHref, projects as defaultProjects, type Project } from './projects';

export interface ProjectSwitcherLabels {
  /** Visible text of the trigger. */
  label: string;
  /** Heading above the list. */
  heading: string;
  /** Description of the current project. */
  youAreHere: string;
  /** Added after the description of a project that links to its source code. */
  sourceCode: string;
}

export interface ProjectSwitcherProps {
  /** Overrides the built in project list. */
  projects?: Project[];
  /** id of the project the switcher is shown in. */
  currentId?: string;
  /** Visible trigger text. `labels.label` wins when both are set. */
  label?: string;
  /** Translated texts. Missing keys keep the English default. Translate project descriptions in `projects`. */
  labels?: Partial<ProjectSwitcherLabels>;
}

const defaultLabels: ProjectSwitcherLabels = {
  label: 'Projects',
  heading: "Eylül Güneş's projects",
  youAreHere: 'You are here',
  sourceCode: '(source code)',
};

function describe(
  project: Project,
  currentId: string | undefined,
  text: ProjectSwitcherLabels,
): string {
  if (project.id === currentId) return text.youAreHere;
  if (project.url) return project.description;
  return `${project.description} ${text.sourceCode}`;
}

/**
 * A menu of Eylül's projects so moving between them feels like one product.
 * Live projects link to their site; the others link to their repository.
 */
export function ProjectSwitcher({
  projects = defaultProjects,
  currentId,
  label,
  labels,
}: ProjectSwitcherProps) {
  const text = { ...defaultLabels, ...(label ? { label } : {}), ...labels };
  return (
    <DropdownMenu>
      <Button variant="tertiary" size="sm" iconLeading={LayoutGrid} iconTrailing={ChevronDown}>
        {text.label}
      </Button>
      <DropdownMenuContent placement="bottom end" popoverClassName="w-80">
        <DropdownMenuSection title={text.heading}>
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              id={project.id}
              href={projectHref(project)}
              icon={project.id === currentId ? Check : undefined}
              description={describe(project, currentId, text)}
            >
              {project.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSection>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
