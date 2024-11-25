import { newSpecPage } from '@stencil/core/testing';
import { ApieTestInput } from '../apie-test-input';

describe('apie-test-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieTestInput],
      html: `<apie-test-input></apie-test-input>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-test-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-test-input>
    `);
  });
});
