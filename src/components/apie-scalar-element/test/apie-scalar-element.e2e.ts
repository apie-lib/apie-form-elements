import { newE2EPage } from '@stencil/core/testing';

describe('apie-scalar-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-scalar-element></apie-scalar-element>');

    const element = await page.find('apie-scalar-element');
    expect(element).toHaveClass('hydrated');
  });
});
