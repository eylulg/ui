import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FileDropZone } from './FileDropZone';

const meta = {
  title: 'Components/FileDropZone',
  component: FileDropZone,
  args: {
    label: 'Drop a JSON file here',
    hint: 'JSON, up to 2 MB',
    acceptedFileTypes: ['.json', 'application/json'],
    onSelect: () => {},
  },
  argTypes: { onSelect: { control: false }, onReject: { control: false } },
  decorators: [(Story) => <div className='max-w-md'>{Story()}</div>],
} satisfies Meta<typeof FileDropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MultipleFiles: Story = {
  args: {
    label: 'Drop images here',
    acceptedFileTypes: ['image/*'],
    allowsMultiple: true,
    hint: 'PNG or JPG',
  },
};
export const Disabled: Story = { args: { isDisabled: true } };

function WithResult() {
  const [names, setNames] = useState<string[]>([]);
  const [refused, setRefused] = useState<string[]>([]);

  function handleSelect(files: File[]) {
    setNames(files.map((file) => file.name));
    setRefused([]);
  }

  function handleReject(files: File[]) {
    setRefused(files.map((file) => file.name));
  }

  return (
    <div className='flex flex-col gap-3'>
      <FileDropZone
        label='Drop a JSON file here'
        hint='JSON, up to 2 MB'
        acceptedFileTypes={['.json']}
        onSelect={handleSelect}
        onReject={handleReject}
      />
      <p role='status' className='text-sm text-secondary'>
        {names.length > 0 && `Loaded ${names.join(', ')}.`}
        {refused.length > 0 && `Only JSON files work. Skipped ${refused.join(', ')}.`}
      </p>
    </div>
  );
}

/** The component holds no file list; the app shows what was chosen and why files were refused. */
export const ResultMessage: Story = { name: 'With result', render: () => <WithResult /> };
