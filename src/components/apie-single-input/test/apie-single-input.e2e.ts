import { newE2EPage } from '@stencil/core/testing';

describe('apie-single-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-single-input name="form[name]" types="text"></apie-single-input>');

    const element = await page.find('apie-single-input');
    expect(element).toHaveClass('hydrated');

    const triggerChange = await page.spyOnEvent('triggerChange');
    await page.waitForChanges();
    const inputElement = await page.find('apie-single-input >>> input');
    await inputElement.focus();
    await inputElement.type('This is a test');
    await page.waitForChanges();
    expect(triggerChange).toHaveReceivedEventDetail({
      name: "form[name]",
      value: 'This is a test'
    });
    expect(await element.getProperty('value')).toEqual('This is a test');
  });
});
