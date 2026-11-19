import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from './CodeBlock';

const theme = `@theme {
  --color-brand-500: #3f6cf0;
  --color-brand-600: #2a4fd6;
  --radius-md: 0.5rem;
}`;

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  args: { children: theme, label: 'Generated Tailwind theme' },
  decorators: [(Story) => <div className='max-w-lg'>{Story()}</div>],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Copyable: Story = { args: { copyable: true } };
export const Wrapped: Story = {
  args: {
    copyable: true,
    wrap: true,
    label: 'Install command',
    children:
      'npm install @eylulg/ui react-aria-components lucide-react @fontsource-variable/inter --save-exact',
  },
};
