export class ConstantService {
   VALIDATOR = {
    REQUIRED: 'required',
    MAXCHARS: 'maxchars',
    MINVALUE: 'minvalue',
    MAXVALUE: 'maxvalue',
    REGEXP: 'regexp',
    MINDATE: 'mindate',
    MAXDATE: 'maxdate',
    MINTIME: 'mintime',
    MAXTIME: 'maxtime',
    EXCLUDEDATES: 'excludedates',
    EXCLUDEDAYS: 'excludedays'
  };
}

export default new ConstantService();
