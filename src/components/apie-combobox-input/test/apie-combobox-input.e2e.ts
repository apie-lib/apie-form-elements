import { newE2EPage } from '@stencil/core/testing';

describe('apie-combobox-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-combobox-input></apie-combobox-input>');

    const element = await page.find('apie-combobox-input');
    expect(element).toHaveClass('hydrated');
  });
});
