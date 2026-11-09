import { Check, ChevronDown, LayoutGrid } from 'lucide-react';
import { Button } from '../components/Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
} from '../components/DropdownMenu/DropdownMenu';
import { projectHref, projects as defaultProjects, type Project } from './projects';

export interface ProjectSwitcherProps {
  /** Overrides the built in project list. */
  projects?: Project[];
  /** id of the project the switcher is shown in. */
  currentId?: string;
  /** Visible trigger text. */
  label?: string;
}

function describe(project: Project, currentId: string | undefined): string {
  if (project.id === currentId) return 'You are here';
  if (project.url) return project.description;
  return `${project.description} (source code)`;
}

/**
 * A menu of Eylül's projects so moving between them feels like one product.
 * Live projects link to their site; the others link to their repository.
 */
export function ProjectSwitcher({
  projects = defaultProjects,
  currentId,
  label = 'Projects',
}: ProjectSwitcherProps) {
  return (
    <DropdownMenu>
      <Button variant="tertiary" size="sm" iconLeading={LayoutGrid} iconTrailing={ChevronDown}>
        {label}
      </Button>
      <DropdownMenuContent placement="bottom end" popoverClassName="w-80">
        <DropdownMenuSection title="Eylül Güneş's projects">
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              id={project.id}
              href={projectHref(project)}
              icon={project.id === currentId ? Check : undefined}
              description={describe(project, currentId)}
            >
              {project.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSection>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
