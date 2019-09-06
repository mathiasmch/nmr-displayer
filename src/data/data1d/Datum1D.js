import baseline from './baseline';
import autoPeakPicking from './autoPeakPicking';
import applyFilter from './filter1d/filter';

import { SHIFT_X } from './filter1d/filter1d-type';

export class Datum1D {
  /**
   *
   * @param {string} id
   * @param {object} options {display: {name, color, isVisible, isPeaksMarksVisible, ...}, meta: {isFid, nucleus}, ... }
   */
  // TODO id can become optional
  // by default Math.random().toString(36).replace('0.','')

  constructor(options = {}) {
    /* TODO
    What are the different categories of information about a Datum1D ?
    * display: {color, isVisible, ...} // all that is related to display information
    * data: {re:[], im:[], y:[], meta: {}}
    * dataSource ????
    * info: {isFid, isComplex, nucleus, solvent, frequency, temperature, ...}
    * ranges: [],
    * signals: [],
    * annotations: [],
    * 
*/
   console.log(options.source);
    this.id =
      options.id ||
      Math.random()
        .toString(36)
        .replace('0.', '');
    this.source = Object.assign(
      {
        jcamp: null,
        jcampURL: null,
        original: [],
      },
      options.source,
    );
    this.display = Object.assign(
      {
        name:
          options.display.name ||
          Math.random()
            .toString(36)
            .replace('0.', ''),
        color: 'black',
        isVisible: true,
        isPeaksMarkersVisible: true,
        isRealSpectrumVisible: true,
      },
      options.display,
    );
    // this.original = options.data; //{ x, re, im }
    this.info = Object.assign(
      {
        nucleus: '1H', // 1H, 13C, 19F, ...
        isFid: false,
        isComplex: false, // if isComplex is true that mean it contains real/ imaginary  x set, if not hid re/im button .
      },
      options.info,
    );
    this.data = Object.assign(
      {
        x: [],
        re: [],
        im: [],
      },
      options.data,
    );
    this.peaks = options.peaks || []; // array of object {index: xIndex, xShift}
    // in case the peak does not exactly correspond to the point value
    // we can think about a second attributed `xShift`
    this.integrals = options.integrals || []; // array of object (from: xIndex, to: xIndex)
    this.signals = options.signals || [];
    this.filters = options.filters || [];

    // [{kind: 'shiftX',value: -5,},{.....}]
  }

  setIsRealSpectrumVisible(isVisible) {
    this.isRealSpectrumVisible = isVisible;
  }

  setPeaks(peaks) {
    this.peaks = peaks;
  }

  getPeaks() {
    return this.peaks;
  }

  setIntegrals(integrals) {
    this.integrals = integrals;
  }

  getIntegrals() {
    return this.integrals;
  }

  baseline(options) {
    // let result = baseline(this.data.x, this.data.re, this.data.im);
  }

  applyAutoPeakPicking(options) {
    // let result = autoPeakPicking(this.data.x, this.data.re);
  }

  applyShiftXFilter(shiftValue) {
    let data = { x: this.data.x, y: this.data.re };
    this.data.x = applyFilter({ kind: SHIFT_X, value: shiftValue }, data).x;
  }

  getReal() {
    return { x: this.data.x, y: this.data.re };
  }

  getImaginary() {
    return { x: this.data.x, y: this.data.im };
  }

  addIntegral(from, to) {}

  /**
   *
   * @param {number} chemicalShift Target chemical shift
   * @param {number} window Range of chemical shifts to look for
   * @example  addPeak(5, 0.1)
   */
  addPeak(chemicalShift, window, options = {}) {}

  autoPeakPicking() {}

  addFilter(filter) {
    this.filters.push(filter);
  }

  toJSON() {
    return {
      data: this.data,
      id: this.id,
      source: {
        jcamp: this.source.jcamp,
        jcampURL: this.source.jcampURL,
        original: (this.source.jcampURL)?[]:this.source.original,
      },
      display: this.display,
      info: this.info,
      peaks: this.peaks,
      integrals: this.integrals,
      signals: this.signals,
      filters: this.filters,
    };
  }
}