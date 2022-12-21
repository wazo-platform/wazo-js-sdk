export type MeetingStatusResponse = {
  full: boolean;
};
export default class MeetingStatus {
  type: string;
  full: boolean;

  constructor({
    full
  }: Record<string, any> = {}) {
    this.full = full;
    // Useful to compare instead of instanceof with minified code
    this.type = 'MeetingStatus';
  }

  static parse(plain: MeetingStatusResponse): MeetingStatus {
    return new MeetingStatus({
      full: plain.full
    });
  }

}