import { newSpecPage } from '@stencil/core/testing';
import { ApieForm } from '../apie-form';

describe('apie-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieForm],
      html: `<apie-form></apie-form>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-form>
    `);
  });
});
