import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-select-definition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-select-definition></apie-form-select-definition>');

    const element = await page.find('apie-form-select-definition');
    expect(element).toHaveClass('hydrated');
  });
});
