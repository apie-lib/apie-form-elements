import { newE2EPage } from '@stencil/core/testing';

describe('apie-display-missing-validation-errors', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-display-missing-validation-errors></apie-display-missing-validation-errors>');

    const element = await page.find('apie-display-missing-validation-errors');
    expect(element).toHaveClass('hydrated');
  });
});
