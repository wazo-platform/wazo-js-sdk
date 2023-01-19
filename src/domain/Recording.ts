import moment from 'moment';

export type RecordingResponse = {
  deleted: boolean;
  end_time: string | null | undefined;
  filename: string;
  start_time: string;
  uuid: string;
};
type RecordingArguments = {
  deleted: boolean;
  end: Date | null | undefined;
  fileName: string;
  start: Date;
  uuid: string;
};
export default class Recording {
  deleted: boolean;

  end: Date | null | undefined;

  fileName: string;

  start: Date;

  uuid: string;

  static parseMany(recordings: RecordingResponse[] = []): Recording[] {
    if (!recordings) {
      return [];
    }

    return recordings.map(item => Recording.parse(item));
  }

  static parse(plain: RecordingResponse): Recording {
    return new Recording({
      deleted: plain.deleted,
      fileName: plain.filename,
      end: plain.end_time ? moment(plain.end_time).toDate() : null,
      start: moment(plain.start_time).toDate(),
      uuid: plain.uuid,
    });
  }

  constructor({
    deleted,
    end,
    fileName,
    start,
    uuid,
  }: RecordingArguments) {
    this.deleted = deleted;
    this.end = end;
    this.fileName = fileName;
    this.start = start;
    this.uuid = uuid;
  }

}
