import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-select></apie-form-select>');

    const element = await page.find('apie-form-select');
    expect(element).toHaveClass('hydrated');
  });
});
