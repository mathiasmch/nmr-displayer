import { jsx, css } from '@emotion/core';
/** @jsx jsx */
import { useCallback } from 'react';

import { useChartData } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import { useHighlight } from '../highlight';
import { DELETE_2D_INTEGRAL } from '../reducer/types/Types';

import { get2DXScale, get2DYScale } from './utilities/scale';

const stylesOnHover = css`
  pointer-events: bounding-box;
  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  user-select: 'none';
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */

  // // disabled because Resizable component appears now when hovering over it
  // :hover .range-area {
  //   height: 100%;
  //   fill: #ff6f0057;
  //   cursor: pointer;
  // }

  .delete-button {
    visibility: hidden;
  }
`;

const stylesHighlighted = css`
  pointer-events: bounding-box;

  @-moz-document url-prefix() {
    pointer-events: fill;
  }
  .Integral-area {
    // height: 100%;
    fill: #ff6f0057;
  }
  .delete-button {
    visibility: visible;
    cursor: pointer;
  }
`;

const Integral = ({ x1, x2, y1, y2, id }) => {
  const highlight = useHighlight([id]);
  const { margin, width, height, xDomain, yDomain } = useChartData();
  const scaleX = get2DXScale({ margin, width, xDomain });
  const scaleY = get2DYScale({ margin, height, yDomain });

  const dispatch = useDispatch();

  const deleteIntegral = useCallback(() => {
    dispatch({ type: DELETE_2D_INTEGRAL, id });
  }, [dispatch, id]);

  const DeleteButton = () => {
    return (
      <svg
        className="delete-button"
        x={scaleX(x1) - 20}
        y={scaleY(y1)}
        onClick={() => deleteIntegral()}
        data-no-export="true"
        width="16"
        height="16"
      >
        <rect rx="5" width="16" height="16" fill="#c81121" />
        <line x1="5" x2="10" y1="8" y2="8" stroke="white" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <g
      css={highlight.isActive ? stylesHighlighted : stylesOnHover}
      key={id}
      {...highlight.onHover}
    >
      <g transform={`translate(${scaleX(x1)},${scaleY(y1)})`}>
        <rect
          x="0"
          width={scaleX(x2) - scaleX(x1)}
          height={scaleY(y2) - scaleY(y1)}
          className="Integral-area"
          fill="#0000000f"
          stroke=" #343a40"
          strokeWidth="0.1"
        />
      </g>

      <DeleteButton />
    </g>
  );
};

export default Integral;
