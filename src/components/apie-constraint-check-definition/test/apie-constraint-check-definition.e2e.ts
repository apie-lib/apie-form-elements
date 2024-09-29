import { newE2EPage } from '@stencil/core/testing';

describe('apie-constraint-check-definition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-constraint-check-definition></apie-constraint-check-definition>');

    const element = await page.find('apie-constraint-check-definition');
    expect(element).toHaveClass('hydrated');
  });
});
