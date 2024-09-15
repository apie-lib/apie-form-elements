import { newSpecPage } from '@stencil/core/testing';
import { ApieFormSelectDefinition } from '../apie-form-select-definition';

describe('apie-form-select-definition', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormSelectDefinition],
      html: `<apie-form-select-definition></apie-form-select-definition>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-select-definition>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-select-definition>
    `);
  });
});
