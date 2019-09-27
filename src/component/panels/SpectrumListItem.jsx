import React from 'react';
import { FaEye, FaMinus, FaPaintBrush } from 'react-icons/fa';

const styles = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
  },
  row: {
    display: 'flex',
    alignContent: 'center',
    height: '25px',
    borderBottom: '0.55px solid #f1f1f1',
  },
  name: {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
};

const SpectrumListItem = ({
  visible,
  activated,
  markersVisible,
  data,
  onChangeVisibility,
  onChangeMarkersVisibility,
  onChangeActiveSpectrum,
  onOpenColorPicker,
}) => {
  const isVisible = (id) => {
    return visible.findIndex((v) => v.id === id) !== -1 ? true : false;
  };

  const isActivated = (id) => {
    return activated && activated.id === id;
  };

  const isMarkerVisible = (id) => {
    return markersVisible.findIndex((v) => v.id === id) !== -1 ? true : false;
  };
  return (
    <div style={styles.row} key={`slist${data.id}`}>
      <button
        style={styles.button}
        type="button"
        onClick={() => onChangeVisibility(data)}
      >
        <FaEye
          style={
            isVisible(data.id)
              ? { opacity: 1, strokeWidth: '1px', fill: data.color }
              : { opacity: 0.1, fill: data.color }
          }
        />
      </button>
      <div style={styles.name}>
        <span>{data.name}</span>
      </div>

      <button
        style={styles.button}
        type="button"
        onClick={() => onChangeMarkersVisibility(data)}
      >
        <FaEye
          style={
            isMarkerVisible(data.id)
              ? { width: 12, opacity: 1, fill: 'black' }
              : { width: 12, opacity: 0.1, fill: 'black' }
          }
        />
      </button>
      <button
        style={styles.button}
        type="button"
        onClick={() => onChangeActiveSpectrum(data)}
      >
        <FaMinus
          style={
            isActivated(data.id)
              ? { fill: data.color, height: '15px' }
              : { fill: data.color, opacity: 0.1 }
          }
        />
      </button>
      <button
        style={styles.button}
        type="button"
        className="color-change-bt"
        onClick={(event) => onOpenColorPicker(data, event)}
      >
        <FaPaintBrush />
      </button>
    </div>
  );
};

export default SpectrumListItem;
