import { ChevronDown, LayoutGrid } from 'lucide-react';
import { buttonStyles } from '../components/Button/buttonStyles';
import { createLazyModule } from '../internal/lazyModule';
import { useLazyMenuTrigger } from '../internal/useLazyMenuTrigger';
import { projects as defaultProjects, type Project } from './projects';

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
  heading: "Eylül's projects",
  youAreHere: 'You are here',
  sourceCode: '(source code)',
};

const menu = /*#__PURE__*/ createLazyModule(() => import('./ProjectSwitcherMenu'));
const trigger = `${buttonStyles({ variant: 'tertiary', size: 'sm' })} hover:bg-hover hover:text-primary`;

/**
 * A menu of Eylül's projects so moving between them feels like one product.
 * Live projects link to their site; the others link to their repository.
 *
 * The trigger is a plain button. The menu, with React Aria's menu and popover
 * code, loads when the trigger is hovered or focused, and at the latest on the
 * first press, which then opens it.
 */
export function ProjectSwitcher({
  projects = defaultProjects,
  currentId,
  label,
  labels,
}: ProjectSwitcherProps) {
  const text = { ...defaultLabels, ...(label ? { label } : {}), ...labels };
  const { loaded, triggerProps } = useLazyMenuTrigger(menu);

  if (loaded)
    return <loaded.ProjectSwitcherMenu projects={projects} currentId={currentId} text={text} />;

  return (
    <button
      type='button'
      data-variant='tertiary'
      data-size='sm'
      className={trigger}
      {...triggerProps}
    >
      <span className='inline-flex items-center gap-[inherit]'>
        <LayoutGrid aria-hidden='true' className='size-4 shrink-0' />
        {text.label}
        <ChevronDown aria-hidden='true' className='size-4 shrink-0' />
      </span>
    </button>
  );
}
