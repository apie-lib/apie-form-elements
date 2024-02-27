import { newSpecPage } from '@stencil/core/testing';
import { ApieDisplayMissingValidationErrors } from '../apie-display-missing-validation-errors';

describe('apie-display-missing-validation-errors', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieDisplayMissingValidationErrors],
      html: `<apie-display-missing-validation-errors></apie-display-missing-validation-errors>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-display-missing-validation-errors>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-display-missing-validation-errors>
    `);
  });
});
