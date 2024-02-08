import { newSpecPage } from '@stencil/core/testing';
import { ApieFormGroup } from '../apie-form-group';

describe('apie-form-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormGroup],
      html: `<apie-form-group></apie-form-group>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-group>
    `);
  });
});
