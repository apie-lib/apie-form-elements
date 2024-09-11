import { newE2EPage } from '@stencil/core/testing';

describe('apie-form-definition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-definition></apie-form-definition>');

    const element = await page.find('apie-form-definition');
    expect(element).toHaveClass('hydrated');
    await page.waitForChanges();
    const definition = await element.callMethod('getDefinition');
    expect(definition).toEqual({ fields: [] });
  });

  it('retrieves all sorts of form fields', async () => {
    const page = await newE2EPage();
    await page.setContent('<apie-form-definition>\
    <apie-form-field-definition name="test"></apie-form-field-definition>\
    <apie-form-group-definition name="group">\
      <apie-form-field-definition name="test"></apie-form-field-definition>\
    </apie-form-group-definition>\
</apie-form-definition>');

    const element = await page.find('apie-form-definition');
    expect(element).toHaveClass('hydrated');
    await page.waitForChanges();
    const definition = await element.callMethod('getDefinition');
    expect(definition).toEqual({ fields: [
      {
        fieldType: "single",
        name: "test",
        types: ['text'],
        additionalSettings: {},
      },
      {
        fieldType: "group",
        name: "group",
        types: ['group'],
        fields: [
          {
            fieldType: "single",
            name: "test",
            types: ['text'],
            additionalSettings: {},
          }
        ]
      }
    ] });
  });
});
