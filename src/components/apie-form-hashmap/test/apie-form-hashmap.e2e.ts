import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-hashmap', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-hashmap></apie-form-hashmap>');

    const element = await page.find('apie-form-hashmap');
    expect(element).toHaveClass('hydrated');
  });
});
