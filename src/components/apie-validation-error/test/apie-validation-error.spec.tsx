import { newSpecPage } from '@stencil/core/testing';
import { ApieValidationError } from '../apie-validation-error';

describe('apie-validation-error', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieValidationError],
      html: `<apie-validation-error></apie-validation-error>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-validation-error>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-validation-error>
    `);
  });
});
