import { CSSProperties } from 'react';

export type Cell = {
    char: string,
    fg: number,
    bg: number,
};

export type Screen = {
    // rows, cols
    cells: Cell[][],
    // rows, cols
    dim: {rows: number, cols: number},
    letterDim: {width: number, height: number},
    mouseHoverCell: {row: number, col: number},
    viewportDim: {width: number, height: number},
};

export type StyleSection = {
    str: string,
    className?: string
    style?: CSSProperties,
};

export type Line = StyleSection[];

export type Shell = {
    promptPrefix: StyleSection[],
    prompt: StyleSection,
    cursor: number
}

export type IState = {
    screen: Screen,
};