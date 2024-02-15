import { newSpecPage } from '@stencil/core/testing';
import { ApieFormSelect } from '../apie-form-select';

describe('apie-form-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormSelect],
      html: `<apie-form-select></apie-form-select>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-select>
    `);
  });
});
