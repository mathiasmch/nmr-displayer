import { Molecule } from 'openchemlib';

import * as SpectraManager from './SpectraManager';
import { Datum1D } from './data1d/Datum1D';
import { Molecule as mol } from './molecules/Molecule';
import { MoleculeManager } from './molecules/MoleculeManager';
import getColor from './utilities/getColor';

export class Analysis {
  spectra = [];
  molecules = [];
  constructor(spectra = [], molecules = [], preferences) {
    this.spectra = spectra.slice();
    this.molecules = molecules.slice(); // chemical structures
    this.preferences = preferences || {};
  }

  static async build(json = {}) {
    const molecules = json.molecules
      ? MoleculeManager.fromJSON(json.molecules)
      : [];
    const analysis = new Analysis([], molecules, json.preferences);
    await SpectraManager.fromJSON(analysis.spectra, json.spectra);
    return analysis;
  }
  // handle zip files
  static usedColors = [];

  async fromZip(zipFiles) {
    for (let zipFile of zipFiles) {
      const color = getColor(true);
      await SpectraManager.addBruker(
        this.spectra,
        { display: { color, name: zipFile.name } },
        zipFile.binary,
      );
    }
  }

  async addJcampFromURL(jcampURL, options) {
    SpectraManager.addJcampFromURL(this.spectra, jcampURL, options);
  }

  addJcamp(jcamp, options = {}) {
    SpectraManager.addJcamp(this.spectra, jcamp, options);
  }

  addJDF(jdf, options = {}) {
    console.log('ddd');
    console.log(options);
    for (let jeolFile of jdf) {
      console.log('jeolFile');
      const color = getColor(true);
      SpectraManager.addJDF(this.spectra, jeolFile, { display: { color } });
    }
  }

  async addMolfileFromURL(molfileURL) {
    let molfile = await fetch(molfileURL).then((response) => response.text());
    this.addMolfile(molfile);
  }

  getMolecules() {
    return this.molecules;
  }

  getPreferences() {
    return this.preferences;
  }

  removeMolecule(key) {
    this.molecules = this.molecules.filter((molecule) => molecule.key !== key);
  }

  addMolfile(molfile) {
    // try to parse molfile
    // this will throw if the molecule can not be parsed !
    let molecule = Molecule.fromMolfile(molfile);
    let fragments = molecule.getFragments();
    this.molecules = Object.assign([], this.molecules);
    for (let fragment of fragments) {
      this.molecules.push(
        new mol({
          molfile: fragment.toMolfileV3(),
          svg: fragment.toSVG(150, 150),
          mf: fragment.getMolecularFormula().formula,
          em: fragment.getMolecularFormula().absoluteWeight,
          mw: fragment.getMolecularFormula().relativeWeight,
        }),
      );
    }
    // we will split if we have many fragments
  }

  setMolecules(molecules) {
    this.molecules = molecules;
  }

  setMolfile(molfile, key) {
    // try to parse molfile
    // this will throw if the molecule can not be parsed !
    let molecule = Molecule.fromMolfile(molfile);
    let fragments = molecule.getFragments();

    if (fragments.length > 1) {
      this.molecules = this.molecules.filter((m) => m.key !== key);

      for (let fragment of fragments) {
        this.molecules.push(
          new mol({
            molfile: fragment.toMolfileV3(),
            svg: fragment.toSVG(150, 150),
            mf: fragment.getMolecularFormula().formula,
            em: fragment.getMolecularFormula().absoluteWeight,
            mw: fragment.getMolecularFormula().relativeWeight,
          }),
        );
      }
    } else if (fragments.length === 1) {
      const fragment = fragments[0];
      const _mol = new mol({
        molfile: fragment.toMolfileV3(),
        svg: fragment.toSVG(150, 150),
        mf: fragment.getMolecularFormula().formula,
        em: fragment.getMolecularFormula().absoluteWeight,
        mw: fragment.getMolecularFormula().relativeWeight,
        key: key,
      });
      let molIndex = this.molecules.findIndex((m) => m.key === key);
      const _molecules = this.molecules.slice();
      _molecules.splice(molIndex, 1, _mol);
      this.molecules = _molecules;
    }

    return this.molecules;
    // we will split if we have many fragments
  }

  /**
   *
   * @param {object} [options={}]
   * @param {boolean} [options.includeData=false]
   */

  toJSON() {
    const spectra = this.spectra.map((ob) => {
      return {
        ...ob.toJSON(),
        data: {},
      };
    });

    const molecules = this.molecules.map((ob) => ob.toJSON());
    return { spectra: spectra, molecules, preferences: this.preferences };
  }

  setPreferences(preferences) {
    this.preferences = { ...this.preferences, ...preferences };
  }

  pushDatum(object) {
    this.spectra.push(object);
  }

  getDatum(id) {
    return this.spectra.find((ob) => ob.id === id);
  }

  /**
   *
   * @param {boolean} isRealData
   */
  getSpectraData() {
    return this.spectra
      ? this.spectra.map((ob) => {
          const data =
            ob instanceof Datum1D ? { ...ob.data, y: ob.data.re } : ob.data;
          return {
            id: ob.id,
            // x: ob.data.x,
            // y: ob.data.re,
            // im: ob.data.im,
            ...data,
            display: ob.display,
            //  name: ob.display.name,
            // color: ob.display.color,
            // isVisible: ob.display.isVisible,
            // isPeaksMarkersVisible: ob.display.isPeaksMarkersVisible,
            // isRealSpectrumVisible: ob.display.isRealSpectrumVisible,
            isVisibleInDomain: ob.display.isVisibleInDomain,
            info: ob.info,
            meta: ob.meta,
            peaks: ob.peaks,
            integrals: ob.integrals,
            filters: ob.filters,
            ranges: ob.ranges,
          };
        })
      : [];
  }

  deleteDatumByIDs(IDs) {
    const _spectra = this.spectra.filter((d) => !IDs.includes(d.id));
    this.spectra = _spectra.length > 0 ? _spectra : [];
  }
}
