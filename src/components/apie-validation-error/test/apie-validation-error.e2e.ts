import { newE2EPage } from '@stencil/core/testing';

describe('apie-validation-error', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-validation-error></apie-validation-error>');

    const element = await page.find('apie-validation-error');
    expect(element).toHaveClass('hydrated');
  });
});
