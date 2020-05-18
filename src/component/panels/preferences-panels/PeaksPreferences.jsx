import lodash from 'lodash';
import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { useAlert } from 'react-alert';

import { useChartData } from '../../context/ChartContext';
import { useDispatch } from '../../context/DispatchContext';
import { SET_PREFERENCES } from '../../reducer/types/Types';
import GroupByInfoKey from '../../utility/GroupByInfoKey';
import { useStateWithLocalStorage } from '../../utility/LocalStorage';
import { GetPreference } from '../../utility/PreferencesHelper';

import ColumnFormatField from './ColumnFormatField';
import { peaksDefaultValues } from './defaultValues';

const styles = {
  container: { padding: 10, backgroundColor: '#f1f1f1', height: '100%' },
  groupContainer: {
    padding: '5px',
    borderRadius: '5px',
    margin: '10px 0px',
    backgroundColor: 'white',
  },
  row: {
    display: 'flex',
    margin: '5px 0px',
  },
  header: {
    borderBottom: '1px solid #e8e8e8',
    paddingBottom: '5px',
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  inputLabel: {
    flex: 2,
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#232323',
  },
  input: {
    width: '30%',
    textAlign: 'center',
  },
};

const PeaksPreferences = forwardRef((props, ref) => {
  const { data, preferences } = useChartData();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [settingData, setSettingsData] = useStateWithLocalStorage('settings');

  const [nucleus, setNucleus] = useState([]);
  const [settings, setSetting] = useState(null);
  const formRef = useRef();

  const getDefaultValues = useCallback((nucleusList) => {
    const _values = nucleusList.reduce((accumulator, key) => {
      accumulator = { ...accumulator, [key]: peaksDefaultValues };
      return accumulator;
    }, {});
    return _values;
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const groupByNucleus = GroupByInfoKey('nucleus');
      const nucleusList = Object.keys(groupByNucleus(data));
      setNucleus(nucleusList);
    }
  }, [data, getDefaultValues, settings]);

  useEffect(() => {
    const peaksPreferences = GetPreference(preferences, 'peaks');
    if (peaksPreferences) {
      setSetting(peaksPreferences);
    }
  }, [preferences]);

  const saveHandler = useCallback(
    (values, showMessage = false) => {
      dispatch({
        type: SET_PREFERENCES,
        data: { type: 'peaks', values },
      });
      if (showMessage) alert.success('Peaks preferences saved successfully');
    },
    [alert, dispatch],
  );

  useImperativeHandle(ref, () => ({
    saveSetting() {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
    },
  }));

  const formatFields = [
    {
      id: 1,
      label: 'Peak Number :',
      checkController: 'showPeakNumber',
      formatController: 'peakNumberFormat',
      defaultFormat: '',
    },
    {
      id: 2,
      label: 'Peak Index : ',
      checkController: 'showPeakIndex',
      formatController: 'peakIndexFormat',
      defaultFormat: '',
    },
    {
      id: 3,
      label: 'δ (ppm) :',
      checkController: 'showDeltaPPM',
      formatController: 'deltaPPMFormat',
      defaultFormat: '00.00',
    },
    {
      id: 4,
      label: 'δ (Hz) :',
      checkController: 'showDeltaHz',
      formatController: 'deltaHzFormat',
      defaultFormat: '00.00',
    },
    {
      id: 5,
      label: 'Peak Width',
      checkController: 'showPeakWidth',
      formatController: 'peakWidthFormat',
      defaultFormat: '00.0000',
    },
    {
      id: 6,
      label: 'Intensity :',
      checkController: 'showIntensity',
      formatController: 'intensityFormat',
      defaultFormat: '00.00',
    },
  ];
  const saveToLocalStorgate = (values) => {
    let globalSettings = { ...settingData };
    globalSettings = lodash.set(globalSettings, 'panels.peaks', values);
    setSettingsData(JSON.stringify(globalSettings));
  };

  const handleSubmit = async (event) => {
    const form = event.target;
    const formData = new FormData(form);
    let values = {};
    for (let field of formData.entries()) {
      const keys = field[0].split('-').join('.');
      const val = ['true', 'false'].includes(field[1])
        ? field[1] === 'true'
        : field[1];
      values = lodash.set(values, keys, val);
    }
    saveHandler(values, true);
    saveToLocalStorgate(values);
  };

  const getValue = useCallback(
    (...params) => {
      const keys = params.join('.');
      if (settings) {
        const value = lodash.get(settings, keys);
        return value ? value : null;
      } else {
        const keyIndex = params.length - 1;
        return peaksDefaultValues[params[keyIndex]];
      }
    },
    [settings],
  );

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} ref={formRef}>
        {nucleus &&
          nucleus.map((nucleusLabel) => (
            <div key={nucleusLabel} style={styles.groupContainer}>
              <p style={styles.header}>{nucleusLabel}</p>
              {formatFields.map((field) => (
                <ColumnFormatField
                  key={field.id}
                  label={field.label}
                  checked={getValue(nucleusLabel, field.checkController)}
                  format={getValue(nucleusLabel, field.formatController)}
                  checkControllerName={field.checkController}
                  formatControllerName={field.formatController}
                  groupID={nucleusLabel}
                />
              ))}
            </div>
          ))}
      </form>
    </div>
  );
});

export default PeaksPreferences;
