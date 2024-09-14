import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-map-definition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<apie-form-field-definition id="list-item" name="test" types="text" label="test"></apie-form-field-definition>'
      + '<apie-form-map-definition name="test" definition-id="test"></apie-form-map-definition>'
    );

    const element = await page.find('apie-form-map-definition');
    expect(element).toHaveClass('hydrated');
    await page.waitForChanges();
    const definition = await element.callMethod('getDefinition');
    expect(definition).toEqual({fieldType: 'group', name: 'test', types: ['group'], fields: []});
  });
});
