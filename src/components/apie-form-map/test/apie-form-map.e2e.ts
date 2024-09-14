import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-map', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-map></apie-form-map>');

    const element = await page.find('apie-form-map');
    expect(element).toHaveClass('hydrated');
  });
});
