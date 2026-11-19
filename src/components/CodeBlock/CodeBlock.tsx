import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';

export interface CodeBlockProps {
  /** The text to show, exactly as it should be copied. */
  children: string;
  /** Accessible name of the block, such as "Generated Tailwind theme". */
  label: string;
  /** Adds a button that copies the text. */
  copyable?: boolean;
  /** Accessible name of the copy button. */
  copyLabel?: string;
  /** Announced after copying. */
  copiedLabel?: string;
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
  className?: string;
}

const copiedForMs = 2000;

const frame = 'relative rounded-lg border border-subtle bg-secondary';
const pre =
  'overflow-auto rounded-lg p-4 font-data text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-focus';

/**
 * Preformatted text in the theme's data font, for generated output, commands
 * and code samples. The block is focusable so a keyboard user can scroll it,
 * and it is a labelled group so a screen reader names it. With `copyable` a
 * button copies the text and a polite status confirms it.
 */
export function CodeBlock({
  children,
  label,
  copyable = false,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied',
  wrap = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), copiedForMs);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cx(frame, className)}>
      <pre
        role='group'
        aria-label={label}
        // A scrollable region must be reachable by keyboard, hence the tab stop on the group.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cx(pre, copyable && 'pr-14', wrap && 'break-words whitespace-pre-wrap')}
      >
        <code>{children}</code>
      </pre>
      {copyable && (
        <>
          <IconButton
            icon={copied ? Check : Copy}
            aria-label={copyLabel}
            variant='tertiary'
            size='sm'
            className='absolute top-2 right-2'
            onPress={handleCopy}
          />
          <span role='status' className='sr-only'>
            {copied ? copiedLabel : ''}
          </span>
        </>
      )}
    </div>
  );
}
