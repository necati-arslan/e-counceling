import { EmailPipe } from './email.pipe';

describe('EmailPipe', () => {
  it('create an instance', () => {
    const pipe = new EmailPipe();
    expect(pipe).toBeTruthy();
  });
});
