import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { acceptsFile, FileDropZone, sortFiles } from '../FileDropZone';

const json = new File(['{}'], 'tokens.JSON', { type: 'application/json' });
const png = new File(['x'], 'logo.png', { type: 'image/png' });

/** React Aria renders the file input hidden, so no role or label reaches it. */
function fileInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error('No file input rendered');
  return input;
}

describe('acceptsFile', () => {
  it.each([
    { accepted: undefined, file: png, result: true },
    { accepted: [], file: png, result: true },
    { accepted: ['.json'], file: json, result: true },
    { accepted: ['application/json'], file: json, result: true },
    { accepted: ['image/*'], file: png, result: true },
    { accepted: ['.json', 'application/json'], file: png, result: false },
    { accepted: ['image/*'], file: json, result: false },
  ])('$accepted against $file.name is $result', ({ accepted, file, result }) => {
    expect(acceptsFile(file, accepted)).toBe(result);
  });
});

describe('sortFiles', () => {
  const second = new File(['{}'], 'second.json', { type: 'application/json' });

  it.each([
    { multiple: true, selected: [json, second], rejected: [png] },
    { multiple: false, selected: [json], rejected: [png, second] },
  ])('with multiple $multiple keeps $selected.length and refuses the rest', (testCase) => {
    const result = sortFiles([png, json, second], ['.json'], testCase.multiple);

    expect(result).toEqual({ selected: testCase.selected, rejected: testCase.rejected });
  });
});

describe('FileDropZone', () => {
  it('hands accepted files to onSelect and the rest to onReject', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onSelect = vi.fn();
    const onReject = vi.fn();
    const { container } = render(
      <FileDropZone
        label="Drop a file here"
        acceptedFileTypes={['.json']}
        allowsMultiple
        onSelect={onSelect}
        onReject={onReject}
      />,
    );

    await user.upload(fileInput(container), [json, png]);

    expect(onSelect).toHaveBeenCalledWith([json]);
    expect(onReject).toHaveBeenCalledWith([png]);
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <FileDropZone label="Drop a JSON file here" hint="JSON, up to 2 MB" onSelect={() => {}} />
        <FileDropZone label="Drop images here" isDisabled onSelect={() => {}} />
      </div>
    ));
  });
});
