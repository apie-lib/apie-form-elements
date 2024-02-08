import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-list></apie-form-list>');

    const element = await page.find('apie-form-list');
    expect(element).toHaveClass('hydrated');
  });
});
