import { jsx, css } from '@emotion/core';
/** @jsx jsx */
import { useCallback, useMemo } from 'react';

import { useDispatch } from '../context/DispatchContext';
import { useScale } from '../context/ScaleContext';
import { useHighlight } from '../highlight';
import { DELETE_RANGE, RESIZE_RANGE } from '../reducer/types/Types';

import Resizable from './Resizable';

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
  .range-area {
    height: 100%;
    fill: #ff6f0057;
  }
  .delete-button {
    visibility: visible;
    cursor: pointer;
  }
`;

const Range = ({ rangeData }) => {
  const { id, from, to, integral, kind, diaID, signal } = rangeData;

  const highlightIDs = useMemo(() => {
    return [].concat(
      [id],
      diaID ? diaID : [],
      signal ? signal.map((_signal) => _signal.diaID).flat() : [],
    );
  }, [diaID, id, signal]);

  const highlight = useHighlight(highlightIDs);

  const { scaleX } = useScale();
  const dispatch = useDispatch();

  const deleteRange = useCallback(() => {
    if (highlight.isActivePermanently) {
      highlight.click();
    }
    highlight.remove(highlightIDs.filter((_id) => _id !== id));
    dispatch({ type: DELETE_RANGE, rangeID: id });
  }, [dispatch, highlight, highlightIDs, id]);

  // const handleOnStartResizing = useCallback(() => {}, []);

  const handleOnStopResizing = useCallback(
    (resized) => {
      dispatch({
        type: RESIZE_RANGE,
        data: { ...rangeData, ...resized },
      });
    },
    [dispatch, rangeData],
  );

  const DeleteButton = () => {
    return (
      <svg
        className="delete-button"
        // transform={`translate(${scaleX()(to) - 20},10)`}
        x={scaleX()(to) - 20}
        y={10}
        onClick={() => deleteRange()}
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
      css={
        highlight.isActive || highlight.isActivePermanently
          ? stylesHighlighted
          : stylesOnHover
      }
      key={id}
      {...highlight.onHover}
      {...highlight.onClick}
    >
      <g transform={`translate(${scaleX()(to)},10)`}>
        <rect
          x="0"
          width={scaleX()(from) - scaleX()(to)}
          height="6"
          className="range-area"
          fill="green"
          fillOpacity={
            (kind && kind === 'signal') ||
            highlight.isActive ||
            highlight.isActivePermanently
              ? 1
              : 0.4
          }
        />
        <text
          textAnchor="middle"
          x={(scaleX()(from) - scaleX()(to)) / 2}
          y="20"
          fontSize="10"
          fill="red"
          fillOpacity={
            (kind && kind === 'signal') ||
            highlight.isActive ||
            highlight.isActivePermanently
              ? 1
              : 0.6
          }
        >
          {integral !== undefined ? integral.toFixed(2) : ''}
        </text>
      </g>
      <Resizable
        from={rangeData.from}
        to={rangeData.to}
        // onDrag={handleOnStartResizing}
        onDrop={handleOnStopResizing}
      />
      <DeleteButton />
    </g>
  );
};

export default Range;
