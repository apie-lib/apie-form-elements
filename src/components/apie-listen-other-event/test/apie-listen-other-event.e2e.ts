import { newE2EPage } from '@stencil/core/testing';

describe('apie-listen-other-event', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-listen-other-event></apie-listen-other-event>');

    const element = await page.find('apie-listen-other-event');
    expect(element).toHaveClass('hydrated');
  });
});
