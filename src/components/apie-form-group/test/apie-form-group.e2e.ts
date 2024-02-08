import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-group></apie-form-group>');

    const element = await page.find('apie-form-group');
    expect(element).toHaveClass('hydrated');
  });
});
