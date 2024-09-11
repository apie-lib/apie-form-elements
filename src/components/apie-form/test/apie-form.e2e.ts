import { newE2EPage } from '@stencil/core/testing';

describe('apie-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form></apie-form>');

    const element = await page.find('apie-form');
    expect(element).toHaveClass('hydrated');
  });
  it('renders a form from a definition', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form definition-id="definition"></apie-form><apie-form-definition id="definition"></apie-form-definition>');

    const element = await page.find('apie-form');
    expect(element).toHaveClass('hydrated');
  })
});
