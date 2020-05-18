import { xyReduce, xyIntegral } from 'ml-spectra-processing';
import React, {
  useEffect,
  useState,
  useCallback,
  Fragment,
  useMemo,
} from 'react';

import { useChartData } from '../context/ChartContext';
import { integralDefaultValues } from '../panels/preferences-panels/defaultValues';
import { GetPreference } from '../utility/PreferencesHelper';

import IntegralResizable from './IntegralResizable';

const Integral = ({
  integralData,
  x,
  y,
  xDomain,
  isActive,
  spectrumID,
  scaleY,
  scaleX,
}) => {
  const { from, to } = integralData;
  const [integral, setIntegral] = useState();
  const { preferences } = useChartData();

  const integralSettings = useMemo(() => {
    let {
      color = integralDefaultValues.color,
      strokeWidth = integralDefaultValues.strokeWidth,
    } = GetPreference(preferences, 'integrals') || {};
    return { color, strokeWidth };
  }, [preferences]);

  useEffect(() => {
    const integralResult = xyIntegral(
      { x: x, y: y },
      {
        from: from,
        to: to,
        reverse: true,
      },
    );
    setIntegral(integralResult);
  }, [from, to, x, y]);

  const makePath = useCallback(() => {
    if (integral && scaleY) {
      const pathPoints = xyReduce(integral, {
        from: xDomain[0],
        to: xDomain[1],
        nbPoints: 200,
        optimize: true,
      });

      let path = `M ${scaleX()(pathPoints.x[0])} ${scaleY(pathPoints.y[0])}`;

      path += pathPoints.x
        .slice(1)
        .map((point, i) => {
          return ` L ${scaleX()(point)} ${scaleY(pathPoints.y[i])}`;
        })
        .join('');
      //   console.log(path);
      return path;
    } else {
      return '';
    }
  }, [integral, scaleX, scaleY, xDomain]);

  return (
    <Fragment>
      <path
        className="line"
        stroke={integralSettings.color}
        strokeWidth={integralSettings.strokeWidth}
        fill="none"
        style={{
          transformOrigin: 'center top',
          opacity: isActive ? 1 : 0.2,
        }}
        d={makePath()}
        // vectorEffect="non-scaling-stroke"
      />

      <IntegralResizable
        spectrumID={spectrumID}
        integralSeries={integral}
        integralData={integralData}
        scaleY={scaleY}
      />
    </Fragment>
  );
};

export default Integral;
