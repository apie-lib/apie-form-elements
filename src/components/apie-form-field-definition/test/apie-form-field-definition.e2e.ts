import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-field-definition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-field-definition name="test"></apie-form-field-definition>');

    const element = await page.find('apie-form-field-definition');
    expect(element).toHaveClass('hydrated');
    await page.waitForChanges();
    const definition = await element.callMethod('getDefinition');
    expect(definition).toEqual({fieldType: 'single', name: 'test', types: ['text'], additionalSettings: {}});
  });
});
