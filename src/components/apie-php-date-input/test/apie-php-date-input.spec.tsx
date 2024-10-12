import { newSpecPage } from '@stencil/core/testing';
import { ApiePhpDateInput } from '../apie-php-date-input';

describe('apie-php-date-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApiePhpDateInput],
      html: `<apie-php-date-input></apie-php-date-input>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-php-date-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-php-date-input>
    `);
  });
});
