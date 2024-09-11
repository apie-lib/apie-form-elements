import { newSpecPage } from '@stencil/core/testing';
import { ApieFormGroupDefinition } from '../apie-form-group-definition';

describe('apie-form-group-definition', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormGroupDefinition],
      html: `<apie-form-group-definition></apie-form-group-definition>`,
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
