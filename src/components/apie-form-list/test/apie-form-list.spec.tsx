import { newSpecPage } from '@stencil/core/testing';
import { ApieFormList } from '../apie-form-list';

describe('apie-form-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieFormList],
      html: `<apie-form-list></apie-form-list>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form-list>
    `);
  });
});
