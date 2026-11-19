import { Upload } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  DropZone,
  FileTrigger,
  Text,
  isFileDropItem,
  type DropZoneProps,
} from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';

export interface FileDropZoneProps {
  /** What the area is for, such as "Drop a JSON file here". Also its accessible name. */
  label: ReactNode;
  /** Constraints before the user errs, such as "JSON, up to 2 MB". */
  hint?: ReactNode;
  /** Text of the button that opens the file picker. Start with a verb. */
  buttonLabel?: string;
  /**
   * Accepted files: extensions (".json"), MIME types ("application/json") or
   * wildcards ("image/*"). Applied to the picker and to dropped files.
   */
  acceptedFileTypes?: readonly string[];
  allowsMultiple?: boolean;
  isDisabled?: boolean;
  /** Files the user chose or dropped that match `acceptedFileTypes`. */
  onSelect: (files: File[]) => void;
  /** Files that were dropped or picked but not accepted: a wrong type, or extra files when only one is allowed. */
  onReject?: (files: File[]) => void;
  className?: string;
}

const zone = [
  'flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-control bg-primary p-card text-center transition-colors',
  'data-drop-target:border-brand data-drop-target:bg-brand-subtle',
  'data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled',
  focusRing,
].join(' ');

/**
 * Whether a file matches an `accept` style list: extensions, MIME types or
 * wildcards. An empty or missing list accepts everything.
 */
export function acceptsFile(file: Pick<File, 'name' | 'type'>, accepted?: readonly string[]) {
  if (!accepted || accepted.length === 0) return true;
  const name = file.name.toLowerCase();
  return accepted.some((pattern) => {
    const rule = pattern.trim().toLowerCase();
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

/**
 * Splits files into those to keep and those to refuse: files that do not
 * match `accepted`, and, when only one file is allowed, every match after the first.
 */
export function sortFiles(
  files: File[],
  accepted: readonly string[] | undefined,
  multiple: boolean,
) {
  const matching = files.filter((file) => acceptsFile(file, accepted));
  const selected = multiple ? matching : matching.slice(0, 1);
  const rejected = files.filter((file) => !selected.includes(file));
  return { selected, rejected };
}

/**
 * A drop area with a button that opens the file picker, so files can be added
 * by dragging or by keyboard. React Aria's DropZone and FileTrigger do the
 * work; this adds the look, type checking and a single `onSelect`. It holds no
 * file list: show what was chosen next to it.
 */
export function FileDropZone({
  label,
  hint,
  buttonLabel = 'Choose file',
  acceptedFileTypes,
  allowsMultiple = false,
  isDisabled = false,
  onSelect,
  onReject,
  className,
}: FileDropZoneProps) {
  function route(files: File[]) {
    const { selected, rejected } = sortFiles(files, acceptedFileTypes, allowsMultiple);
    if (selected.length > 0) onSelect(selected);
    if (rejected.length > 0) onReject?.(rejected);
  }

  async function handleDrop(event: Parameters<NonNullable<DropZoneProps['onDrop']>>[0]) {
    const items = event.items.filter(isFileDropItem);
    route(await Promise.all(items.map((item) => item.getFile())));
  }

  function handleSelect(files: FileList | null) {
    route(files ? [...files] : []);
  }

  return (
    <DropZone isDisabled={isDisabled} onDrop={handleDrop} className={cx(zone, className)}>
      <Upload aria-hidden='true' className='size-6 text-fg-tertiary' />
      <Text slot='label' className='text-sm font-medium text-primary'>
        {label}
      </Text>
      {hint && <span className='text-sm text-tertiary'>{hint}</span>}
      <FileTrigger
        acceptedFileTypes={acceptedFileTypes}
        allowsMultiple={allowsMultiple}
        onSelect={handleSelect}
      >
        <Button variant='secondary' size='sm' isDisabled={isDisabled}>
          {buttonLabel}
        </Button>
      </FileTrigger>
    </DropZone>
  );
}
