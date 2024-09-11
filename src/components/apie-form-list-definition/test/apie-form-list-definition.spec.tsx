import { newSpecPage } from '@stencil/core/testing';
import { ApieFormListDefinition } from '../apie-form-list-definition';

describe('apie-form-group-definition', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormListDefinition],
      html: `<apie-form-list-definition></apie-form-list-definition>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-group-definition>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-group-definition>
    `);
  });
});
