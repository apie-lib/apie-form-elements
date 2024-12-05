import { newSpecPage } from '@stencil/core/testing';
import { ApieComboboxInput } from '../apie-combobox-input';

describe('apie-combobox-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieComboboxInput],
      html: `<apie-combobox-input></apie-combobox-input>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-combobox-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-combobox-input>
    `);
  });
});
