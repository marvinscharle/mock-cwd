import { mkdirSync } from 'fs';
import { join } from 'path';
import * as randomString from 'randomstring';
import tempDirectory from 'temp-dir';

/**
 * Handler for the mocked current working directory
 */
export class MockedCurrentWorkingDirectory {
  private readonly originalPath: string;

  constructor(
    private readonly fakePath: string,
  ) {
    this.originalPath = process.cwd();
  }

  /**
   * Applies the mock
   */
  public apply(): void {
    process.cwd = () => this.fakePath;
  }

  /**
   * Restores the original cwd.
   */
  public restore(): void {
    process.cwd = () => this.originalPath;
  }
}

/**
 * Mocks process.cwd() to a new folder inside the temp directory.
 */
export function mockCwd(): MockedCurrentWorkingDirectory;

/**
 * Mocks process.cwd() to return fakePath.
 * @param fakePath
 */
export function mockCwd(fakePath: string): MockedCurrentWorkingDirectory;

/**
 * Mocks process.cwd() calls inside wrapper() to a new folder inside the temp directory.
 * @param wrapper
 */
export function mockCwd(wrapper: () => unknown): void;

/**
 * Mocks process.cwd() calls inside wrapper() to return fakePath.
 * @param fakePath
 * @param wrapper
 */
export function mockCwd(fakePath: string, wrapper: () => unknown): void;

/**
 * Mocks process.cwd() calls inside wrapper() to a new folder inside the temp directory.
 * @param wrapper
 */
export function mockCwd(wrapper: () => Promise<unknown>): Promise<void>;

/**
 * Mocks process.cwd() calls inside wrapper() to return fakePath.
 * @param fakePath
 * @param wrapper
 */
export function mockCwd(fakePath: string, wrapper: () => Promise<unknown>): Promise<void>;
export function mockCwd(
  fakePathOrWrapper?: string | (() => Promise<unknown> | unknown),
  wrapper?: () => Promise<unknown> | unknown,
): Promise<void> | void | MockedCurrentWorkingDirectory {
  let givenPath: string;
  let givenWrapper: (() => Promise<unknown> | unknown) | undefined;

  if (typeof fakePathOrWrapper === 'function') {
    givenPath = createFakeTempFolder();
    givenWrapper = fakePathOrWrapper;
  } else if (typeof fakePathOrWrapper === 'string') {
    givenPath = fakePathOrWrapper;
    givenWrapper = wrapper;
  } else {
    // fakePathOrWrapper is undefined
    givenPath = createFakeTempFolder();
    givenWrapper = undefined;
  }

  // Initialize mock
  const mock = new MockedCurrentWorkingDirectory(givenPath);
  mock.apply();

  // Response depends on givenWrapper
  if (givenWrapper === undefined) {
    return mock;
  }

  try {
    // Check if givenWrapper returns Promise
    const response = givenWrapper();
    if (response instanceof Promise) {
      return response
        .then(() => {
          mock.restore();
        })
        .catch(e => {
          mock.restore();
          throw e;
        });
    } else {
      // givenWrapper returned synchronously -> restore immediately
      mock.restore();
    }
  } catch (e) {
    mock.restore();
    throw e;
  }
}

function createFakeTempFolder(): string {
  const folderPath = join(tempDirectory, randomString.generate());
  mkdirSync(folderPath);

  return folderPath;
}
