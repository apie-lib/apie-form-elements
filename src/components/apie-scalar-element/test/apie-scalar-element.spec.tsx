import { newSpecPage } from '@stencil/core/testing';
import { ApieScalarElement } from '../apie-scalar-element';

describe('apie-scalar-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieScalarElement],
      html: `<apie-scalar-element></apie-scalar-element>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-scalar-element>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-scalar-element>
    `);
  });
});
