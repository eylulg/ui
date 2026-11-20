import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList,
  composeRenderProps,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps,
  type TagProps as AriaTagProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel } from '../../internal/Field';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';

export interface TagGroupProps<T extends object>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: string;
}

/**
 * A focusable group of tags. Pass `onRemove` to make every tag removable with
 * its close button or the Delete and Backspace keys.
 */
export function TagGroup<T extends object>({
  label,
  hint,
  errorMessage,
  items,
  children,
  renderEmptyState,
  className,
  ...props
}: TagGroupProps<T>) {
  return (
    <AriaTagGroup
      {...props}
      className={cx('flex flex-col gap-1.5', typeof className === 'string' ? className : undefined)}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <TagList
        items={items}
        renderEmptyState={renderEmptyState}
        className='flex flex-wrap gap-1.5 outline-none'
      >
        {children}
      </TagList>
      {hint && <FieldHint>{hint}</FieldHint>}
      {errorMessage && <FieldErrorMessage>{errorMessage}</FieldErrorMessage>}
    </AriaTagGroup>
  );
}

export interface TagProps extends Omit<AriaTagProps, 'children'> {
  children: ReactNode;
}

export function Tag({ children, className, ...props }: TagProps) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <AriaTag
      {...props}
      textValue={textValue}
      className={composeRenderProps(className, (consumer) =>
        cx(
          'inline-flex h-7 touch-target cursor-default items-center gap-1 rounded-sm border border-default bg-primary px-2 text-sm font-medium text-secondary',
          'data-selected:border-brand data-selected:bg-brand-subtle data-selected:text-brand',
          'data-disabled:text-disabled',
          focusRing,
          consumer,
        ),
      )}
    >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <AriaButton
              slot='remove'
              className={cx(
                '-mr-1 flex size-5 cursor-pointer items-center justify-center rounded-xs text-fg-tertiary',
                'data-hovered:bg-hover data-hovered:text-fg-secondary',
                focusRing,
              )}
            >
              <X aria-hidden='true' className='size-3.5' />
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  );
}
