import React, { useState, useEffect } from 'react';
import { MF } from 'react-mf';

import NMRDisplayer from '../../component/NMRDisplayer.jsx';
import { StructureEditor } from 'react-ocl/full';
import { Molecule } from 'openchemlib';

async function loadData(file) {
  const response = await fetch(file);
  checkStatus(response);
  const data = await response.json();
  return data;
}

function checkStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
  return response;
}

export default function Exercise(props) {
  const [data, setData] = useState();
  const { file, title } = props;

  function checkAnswer(response) {
    if (
      data &&
      data.molecules &&
      data.molecules[0] &&
      data.molecules[0].molfile
    ) {
      const MolResult = Molecule.fromMolfile(data.molecules[0].molfile);
      const MolResponse = Molecule.fromMolfile(response);
      const idCodeResult = MolResult.getIDCode();
      const idCodeResponse = MolResponse.getIDCode();
      console.log({ idCodeResponse, idCodeResult });
      if (idCodeResult === idCodeResponse) {
        // correct answer
      } else {
        // wrong answer
      }
    }
  }

  function getMF(data) {
    let mf = '';
    if (
      data &&
      data.molecules &&
      data.molecules[0] &&
      data.molecules[0].molfile
    ) {
      const molecule = Molecule.fromMolfile(data.molecules[0].molfile);
      mf = molecule.getMolecularFormula().formula;
    }
    // need to display the MF somehow
  }

  useEffect(() => {
    if (file) {
      loadData(file).then((d) => {
        setData(d);
      });
    } else {
      setData({});
    }
  }, [file, props]);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 30,
      }}
    >
      <h5 className="title">
        Display and process 1D NMR spectra from a jcamp-dx file
      </h5>
      <p className="category">{title}</p>
      <div style={{ display: 'flex', height: '60%' }}>
        <div style={{ width: '70%' }}>
          <NMRDisplayer
            data={data}
            preferences={{
              panels: {
                hidePeaksPanel: true,
                hideInformationPanel: true,
                hideRangesPanel: true,
                hideStructuresPanel: true,
                hideFiltersPanel: true,
              },
            }}
          />
        </div>

        <div
          style={{
            height: '100%',
            // border: '1px dashed black',
            width: '30%',
            backgroundColor: '#e9f6ff',

            // flex: '1',
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
          }}
        >
          <StructureEditor
            svgMenu={true}
            fragment={false}
            onChange={checkAnswer}
          />
        </div>
      </div>
      <div>
        <MF style={{ color: 'navy', fontSize: 30 }} mf="Al2(SO4)3" />
      </div>
    </div>
  );
}
