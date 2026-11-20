import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandLoader } from '../BrandLoader';

describe('BrandLoader', () => {
  it('announces the given label as a status', () => {
    render(<BrandLoader label='Loading the page' />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading the page');
  });
});
