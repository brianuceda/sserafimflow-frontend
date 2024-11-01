import { SafehtmlPipe } from '../../../features/company/data-access/safehtml.pipe';

describe('SafehtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafehtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
