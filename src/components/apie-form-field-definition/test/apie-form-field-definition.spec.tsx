import { newSpecPage } from '@stencil/core/testing';
import { ApieFormFieldDefinition } from '../apie-form-field-definition';

describe('apie-form-field-definition', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormFieldDefinition],
      html: `<apie-form-field-definition></apie-form-field-definition>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-field-definition>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-field-definition>
    `);
  });
});
