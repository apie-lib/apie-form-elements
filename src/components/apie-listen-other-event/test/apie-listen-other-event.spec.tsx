import { newSpecPage } from '@stencil/core/testing';
import { ApieListenOtherEvent } from '../apie-listen-other-event';

describe('apie-listen-other-event', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ApieListenOtherEvent],
      html: `<apie-listen-other-event></apie-listen-other-event>`,
    });
    expect(page.root).toEqualHtml(`
      <apie-listen-other-event>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </apie-listen-other-event>
    `);
  });
});
