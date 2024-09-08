import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-group', () => {
  it('renders and reads values from input field', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-group read-from-input name="form"><apie-single-input name="form[name]" types="text" value="12"></apie-single-input></apie-form-group>');

    const element = await page.find('apie-form-group');
    expect(element).toHaveClass('hydrated');

    await page.waitForChanges();
    expect(await element.getProperty('value')).toEqual({
      name: '12'
    });
  });
  it('renders and sets values from property', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-group name="form"><apie-single-input name="form[name]" types="text"></apie-single-input></apie-form-group>');

    const element = await page.find('apie-form-group');
    expect(element).toHaveClass('hydrated');
    element.setProperty('value', { name: 12 });
    await page.waitForChanges();
    const inputElement = await page.find('apie-single-input >>> input');

    expect(await inputElement.getProperty('value')).toEqual('12');
  });
});
