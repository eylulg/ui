import { Check, ChevronDown, LayoutGrid } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../components/Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
} from '../components/DropdownMenu/DropdownMenu';
import { useOpenAfterFocus } from '../internal/useLazyMenuTrigger';
import { projectHref, type Project } from './projects';
import type { ProjectSwitcherLabels } from './ProjectSwitcher';

interface ProjectSwitcherMenuProps {
  projects: Project[];
  currentId: string | undefined;
  text: ProjectSwitcherLabels;
}

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
 * The real menu behind ProjectSwitcher. ProjectSwitcher loads this module on
 * the first press, and the menu opens as soon as it mounts.
 */
export function ProjectSwitcherMenu({ projects, currentId, text }: ProjectSwitcherMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useOpenAfterFocus(triggerRef);

  return (
    <DropdownMenu isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        ref={triggerRef}
        variant="tertiary"
        size="sm"
        iconLeading={LayoutGrid}
        iconTrailing={ChevronDown}
      >
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
