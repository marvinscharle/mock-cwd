import tempDirectory from 'temp-dir';
import { mockCwd } from './index';

describe('mockCwd', () => {
  let originalCwd: string;

  beforeEach(() => originalCwd = process.cwd());

  it('should return MockedCurrentWorkingDirectory pointing to new fake directory when accessing without parameters', async () => {
    // Apply mock
    const mock = mockCwd();
    expect(process.cwd()).not.toBe(originalCwd);
    expect(process.cwd().startsWith(tempDirectory)).toBeTruthy();

    // Restore mock
    mock.restore();
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should return MockedCurrentWorkingDirectory pointing to given path', async () => {
    // Apply mock
    const mock = mockCwd('/my/random/path');
    expect(process.cwd()).not.toBe(originalCwd);
    expect(process.cwd()).toBe('/my/random/path');

    // Restore mock
    mock.restore();
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should run wrapper pointing to new fake directory', async () => {
    // Apply mock
    mockCwd(() => {
      expect(process.cwd()).not.toBe(originalCwd);
      expect(process.cwd().startsWith(tempDirectory)).toBeTruthy();
    });

    // Restore mock
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should run wrapper returning Promise pointing to new fake directory', async () => {
    // Apply mock
    await mockCwd(async () => {
      expect(process.cwd()).not.toBe(originalCwd);
      expect(process.cwd().startsWith(tempDirectory)).toBeTruthy();
      return Promise.resolve();
    });

    // Restore mock
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should run wrapper pointing to given path', async () => {
    // Apply mock
    mockCwd('/my/random/path', () => {
      expect(process.cwd()).not.toBe(originalCwd);
      expect(process.cwd()).toBe('/my/random/path');
    });

    // Restore mock
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should run wrapper returning Promise pointing to given path', async () => {
    // Apply mock
    await mockCwd('/my/random/path', async () => {
      expect(process.cwd()).not.toBe(originalCwd);
      expect(process.cwd()).toBe('/my/random/path');
      return Promise.resolve();
    });

    // Restore mock
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should restore the original path when an error occurs within wrapper', async () => {
    try {
      mockCwd(() => {
        throw new Error();
      });
    } catch (e) {
    }

    // mockCwd should be original path
    expect(process.cwd()).toBe(originalCwd);
  });

  it('should restore the original path when an error occurs within wrapper - promise', async () => {
    try {
      await mockCwd(async () => {
        throw new Error();
      });
    } catch (e) {
    }

    // mockCwd should be original path
    expect(process.cwd()).toBe(originalCwd);
  });
});
