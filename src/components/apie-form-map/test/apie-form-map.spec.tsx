import { newSpecPage } from '@stencil/core/testing';
import { ApieFormMap } from '../apie-form-map';

describe('apie-form-map', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormMap],
      html: `<apie-form-map></apie-form-map>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-map>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-map>
    `);
  });
});
