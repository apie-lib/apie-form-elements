import { newSpecPage } from '@stencil/core/testing';
import { ApieFormHashmap } from '../apie-form-hashmap';

describe('apie-form-hashmap', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormHashmap],
      html: `<apie-form-hashmap></apie-form-hashmap>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-hashmap>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-hashmap>
    `);
  });
});
