import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-group-definition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-group-definition name="test"></apie-form-group-definition>');

    const element = await page.find('apie-form-group-definition');
    expect(element).toHaveClass('hydrated');
    await page.waitForChanges();
    const definition = await element.callMethod('getDefinition');
    expect(definition).toEqual({fieldType: 'group', name: 'test', types: ['group'], fields: []});
  });
});
