import { describe, it, expect } from 'vitest';
import { handleBrowserMessage, type IPty } from '../../src/server/tmux-pty';

function makePtyStub() {
  const writes: string[] = [];
  const resizes: Array<[number, number]> = [];
  const pty: IPty = {
    onData: () => {},
    onExit: () => {},
    write: (data: string) => writes.push(data),
    resize: (cols: number, rows: number) => resizes.push([cols, rows]),
    kill: () => {},
    pid: 1234,
  };
  return { pty, writes, resizes };
}

describe('handleBrowserMessage', () => {
  it('writes plain string keystrokes to the pty', () => {
    const { pty, writes } = makePtyStub();
    handleBrowserMessage(pty, 'ls\r');
    expect(writes).toEqual(['ls\r']);
  });

  it('decodes Buffer keystrokes (ws delivers text frames as Buffers)', () => {
    const { pty, writes } = makePtyStub();
    handleBrowserMessage(pty, Buffer.from('echo hi\r', 'utf8'));
    expect(writes).toEqual(['echo hi\r']);
  });

  it('handles resize control frames delivered as a Buffer', () => {
    const { pty, writes, resizes } = makePtyStub();
    handleBrowserMessage(
      pty,
      Buffer.from(JSON.stringify({ type: 'resize', cols: 100, rows: 40 })),
    );
    expect(resizes).toEqual([[100, 40]]);
    expect(writes).toEqual([]);
  });

  it('decodes ArrayBuffer payloads', () => {
    const { pty, writes } = makePtyStub();
    const buf = new TextEncoder().encode('x').buffer;
    handleBrowserMessage(pty, buf);
    expect(writes).toEqual(['x']);
  });

  it('concatenates fragmented Buffer[] payloads', () => {
    const { pty, writes } = makePtyStub();
    handleBrowserMessage(pty, [Buffer.from('a'), Buffer.from('b')]);
    expect(writes).toEqual(['ab']);
  });
});
