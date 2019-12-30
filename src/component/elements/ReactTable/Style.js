import { css } from '@emotion/core';

const Style = css`
    border-spacing: 0;
    border: 1px solid #dedede;
    width: 100%;
    font-size:12px;
    height: 100%;
        
 

    tr {
    :last-child {
        td {
        border-bottom: 0;
        }
    }
    }
    th,
    td {
    margin: 0;
    padding: 0.4rem;
    border-bottom: 1px solid #dedede;
    border-right: 1px solid #dedede;

    :last-child {
        border-right: 0;
    }

    button{
        background-color: transparent;
        border: none;

    }

`;

export default Style;
