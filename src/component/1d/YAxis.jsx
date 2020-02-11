import { Fragment, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { useChartData } from '../context/ChartContext';

const axisStyles = css`
  user-select: 'none';
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */

  path,
  line {
    fill: none;
    stroke: black;
    stroke-width: 1;
    shape-rendering: crispEdges;
    user-select: 'none';
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
  }
`;

const YAxis = ({ show, label }) => {
  const refAxis = useRef();
  const { yDomain, scaleY, getScale, margin, verticalAlign } = useChartData();

  useEffect(() => {
    if (show && yDomain) {
      const axis = d3
        .axisLeft()
        .ticks(10)
        .tickFormat(d3.format('~s'));

      d3.select(refAxis.current).call(axis.scale(scaleY));
    }
  }, [show, yDomain, getScale, scaleY]);

  const Axis = useMemo(
    () =>
      show &&
      show === true && (
        <Fragment>
          <g
            className="y"
            css={axisStyles}
            transform={`translate(${margin.left + 50},-${verticalAlign})`}
            ref={refAxis}
          >
            <text
              fill="#000"
              x={-(margin.top + 20)}
              y={-(margin.left - 5)}
              dy="0.71em"
              transform="rotate(-90)"
              textAnchor="end"
            >
              {label}
            </text>
          </g>
        </Fragment>
      ),

    [label, margin.left, margin.top, show, verticalAlign],
  );

  return Axis;
};

export default YAxis;

YAxis.contextTypes = {
  showGrid: PropTypes.bool,
  show: PropTypes.bool,
  label: PropTypes.string,
};

YAxis.defaultProps = {
  showGrid: false,
  show: true,
  label: '',
};