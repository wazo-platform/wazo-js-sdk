import newFrom from '../utils/new-from';

type Response = {
  number?: string;
  type: 'main' | 'associated' | 'anonymous';
  caller_id_name?: string;
};

type ListResponse = {
  items: Response[];
};

type Arguments = {
  number?: string;
  type: 'main' | 'associated' | 'anonymous';
  callerIdName?: string;
};

export default class CallerID {
  number?: string;

  idType: 'main' | 'associated' | 'anonymous';

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
