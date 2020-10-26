/* eslint-disable no-underscore-dangle */
import IssueReporter from '../IssueReporter';
import { realFetch } from '../../utils/api-requester';

jest.mock('../../utils/api-requester');

let fetch;

describe('IssueReporter', () => {
  beforeEach(() => {
    fetch = jest.fn();
    realFetch.mockImplementation(() => fetch);
  });

  it('should compute level order', () => {
    expect(IssueReporter._isLevelAbove('info', 'trace')).toBeTruthy();
    expect(IssueReporter._isLevelAbove('trace', 'warn')).toBeFalsy();
    expect(IssueReporter._isLevelAbove('error', 'warn')).toBeTruthy();
    expect(IssueReporter._isLevelAbove('info', 'warn')).toBeFalsy();
    expect(IssueReporter._isLevelAbove('trace', 'trace')).toBeFalsy();
  });

  it('should send if verbosity is higher than required', () => {
    // Same level
    IssueReporter.configureRemoteClient({ level: 'trace' });
    IssueReporter._sendToRemoteLogger('info');
    expect(fetch).toHaveBeenCalled();
  });

  it('should send if verbosity is equal than required', () => {
    // Same level
    IssueReporter.configureRemoteClient({ level: 'trace' });
    IssueReporter._sendToRemoteLogger('trace');
    expect(fetch).toHaveBeenCalled();
  });

  it('should not send if verbosity is lower than required', () => {

    // Lower level
    IssueReporter.configureRemoteClient({ level: 'info' });
    IssueReporter._sendToRemoteLogger('trace');
    expect(fetch).not.toHaveBeenCalled();
  });
});
