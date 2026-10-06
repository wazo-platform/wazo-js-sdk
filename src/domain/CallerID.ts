import newFrom from '../utils/new-from';

// `default` and `custom` are only reported for the default outgoing caller ID
export type CallerIDType = 'main' | 'associated' | 'shared' | 'anonymous' | 'default' | 'custom';

type Response = {
  number?: string;
  type: CallerIDType;
  caller_id_name?: string;
};

type ListResponse = {
  items: Response[];
};

type Arguments = {
  number?: string;
  type: CallerIDType;
  callerIdName?: string;
};

export default class CallerID {
  number?: string;

  idType: CallerIDType;

  type: string;

  callerIdName?: string;

  static parse(plain: Response): CallerID {
    return new CallerID({
      number: plain.number,
      type: plain.type,
      callerIdName: plain.caller_id_name,
    });
  }

  static parseMany(plain: ListResponse): CallerID[] {
    return plain.items.map(item => CallerID.parse(item));
  }

  static newFrom(profile: CallerID) {
    return newFrom(profile, CallerID);
  }

  constructor({
    type,
    number,
    callerIdName,
  }: Arguments) {
    this.idType = type;
    this.number = number;
    this.callerIdName = callerIdName;
    // Useful to compare instead of instanceof with minified code
    this.type = 'CallerID';
  }

}
