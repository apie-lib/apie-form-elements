import { newSpecPage } from '@stencil/core/testing';
import { ApieFormMapDefinition } from '../apie-form-map-definition';

describe('apie-form-group-definition', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormMapDefinition],
      html: `<apie-form-map-definition></apie-form-map-definition>`,
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
