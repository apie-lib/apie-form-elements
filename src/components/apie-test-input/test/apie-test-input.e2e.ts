import { newE2EPage } from '@stencil/core/testing';

describe('apie-test-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-test-input></apie-test-input>');

    const element = await page.find('apie-test-input');
    expect(element).toHaveClass('hydrated');
  });
});
