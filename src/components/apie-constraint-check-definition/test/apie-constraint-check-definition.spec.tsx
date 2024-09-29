import { newSpecPage } from '@stencil/core/testing';
import { ApieConstraintCheckDefinition } from '../apie-constraint-check-definition';

describe('apie-constraint-check-definition', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieConstraintCheckDefinition],
      html: `<apie-constraint-check-definition></apie-constraint-check-definition>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-constraint-check-definition>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-constraint-check-definition>
    `);
  });
});
