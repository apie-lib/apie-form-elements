import { newE2EPage } from '@stencil/core/testing';

describe('apie-php-date-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-php-date-input></apie-php-date-input>');

    const element = await page.find('apie-php-date-input');
    expect(element).toHaveClass('hydrated');
  });
});
