import { combineReducers } from 'redux';
import { createAction, handleActions, Action } from 'redux-actions';
import { RoseKeycode } from './utility';
import { IState, Cell } from './model';

import {
    KEY_DOWN,
    KEY_UP,
    MOUSE_DOWN,
    MOUSE_UP,
    MOUSE_MOVE,
    WINDOW_RESIZE,
} from './constants';

type KeyDownPayload = { code: RoseKeycode, char: string };

const keyDown = createAction<KeyDownPayload, RoseKeycode, string>(
    KEY_DOWN,
    (code, char) => ({code, char})
);

type KeyUpPayload = RoseKeycode;

const keyUp = createAction<KeyUpPayload, RoseKeycode>(
    KEY_UP,
    code => code
);

type MouseActionPayload = {button: number, row: number, col: number, time: Date};

const mouseDown = createAction<MouseActionPayload, number, number, number, Date>(
    MOUSE_DOWN,
    (button, row, col, time) => ({button, row, col, time})
);

const mouseUp = createAction<MouseActionPayload, number, number, number, Date>(
    MOUSE_UP,
    (button, row, col, time) => ({button, row, col, time})
);

const mouseMove = createAction<MouseActionPayload, number, number, number, Date>(
    MOUSE_MOVE,
    (button, row, col, time) => ({button, row, col, time})
);

type WindowResizeActionPayload = {width: number, height: number};

const windowResize = createAction<WindowResizeActionPayload, number, number>(
    WINDOW_RESIZE,
    (width, height) => ({width, height})
);

export {
    keyDown,
    keyUp,
    mouseDown,
    mouseUp,
    mouseMove,
    windowResize,
};
const NUMROWS = 40;
const NUMCOLS = 80;

function randomChar()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    return possible.charAt(Math.floor(Math.random() * possible.length));
}

export function viewportW () {
    var a = document.documentElement['clientWidth'], b = window['innerWidth'];
    return a < b ? b : a;
}
export function viewportH() {
    var a = document.documentElement['clientHeight'], b = window['innerHeight'];
    return a < b ? b : a;
};

const initialState: IState = {
    screen: {
        dim: {
            rows: NUMROWS,
            cols: NUMCOLS,
        },
        letterDim: (() => {
            if (typeof window !== 'undefined') {
                return {
                    width: 12,
                    height: 14,
                };
            } else {
                return {
                    width: 8,
                    height: 9,
                };
            }
        })(),
        mouseHoverCell: {
            row: -1,
            col: -1
        },
        viewportDim: {
            width: viewportW(),
            height: viewportH(),
        },
        cells: ((numrows: number, numcols: number) => {
            let res: Cell[][] = [];
            for (let row = 0; row < numrows; row++) {
                let r: Cell[] = [];
                for (let col = 0; col < numcols; col++) {
                    let c: Cell = {
                        char: randomChar(),
                        fg: 2,
                        bg: 1,
                    };
                    r.push(c);
                }
                res.push(r);
            }
            return res;
        })(NUMROWS, NUMCOLS)
    }
}

type ActionPayload = KeyDownPayload | KeyUpPayload | MouseActionPayload | WindowResizeActionPayload;

const reducer = handleActions<IState, ActionPayload>({
    [KEY_DOWN]: (state: IState, action: Action<KeyDownPayload>): IState => {
        return state;
    },
    [KEY_UP]: (state: IState, action: Action<KeyUpPayload>): IState => {
        return state;
    },
    [MOUSE_DOWN]: (state: IState, action: Action<MouseActionPayload>): IState => {
        return {
            ...state,
            screen: {
                ...state.screen,
                cells: state.screen.cells.map((row: Cell[]): Cell[] => {
                    return row.map((cell: Cell): Cell => {
                        return {
                            ...cell,
                            char: randomChar(),
                        };
                    });
                }),
            },
            
        }
    },
    [MOUSE_UP]: (state: IState, action: Action<MouseActionPayload>): IState => {
        return state;
    },
    [MOUSE_MOVE]: (state: IState, action: Action<MouseActionPayload>): IState => {
        const row = action.payload.row;
        const col = action.payload.col;
        const oldRow = state.screen.mouseHoverCell.row;
        const oldCol = state.screen.mouseHoverCell.col;
        
        if (col === oldCol && row === oldRow) {
            return state;
        }

        return {
            ...state,
            screen: {
                ...state.screen,
                cells: state.screen.cells.map((rowCells: Cell[], rowIdx: number): Cell[] => {
                    return rowCells.map((cell: Cell, colIdx: number): Cell => {
                        let rowDiff = Math.abs(row-rowIdx);
                        let colDiff = Math.abs(col-colIdx);
                        if ((rowDiff <= 1) !== (colDiff <= 1)) {
                            return {
                                ...cell,
                                fg: 1,
                                bg: 2,
                            };
                        } else if (cell.fg === 1 && cell.bg === 2) {
                            return {
                                ...cell,
                                fg: 2,
                                bg: 1,
                            };
                        } else {
                            return cell;
                        }
                    });
                }),
            },
            mouseHoverCell: {
                row: action.payload.row,
                col: action.payload.col,
            }
            
        }
        // return state;
    },
    [WINDOW_RESIZE]: (state: IState, action: Action<WindowResizeActionPayload>): IState => {
        if (state.screen.viewportDim.width !== action.payload.width || state.screen.viewportDim.height !== action.payload.height) {
            return {
                ...state,
                screen: {
                    ...state.screen,
                    viewportDim: {
                        width: action.payload.width,
                        height: action.payload.height,
                    },
                },
            };
        } else {
            return state;
        }
    },
}, initialState);

const rootReducer = reducer;
export default rootReducer;