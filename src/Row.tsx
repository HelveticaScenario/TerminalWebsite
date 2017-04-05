import * as React from "react";
import * as Model from './model';

interface RowProps {
    cells: Model.Cell[];
}

export const Row = (allProps: RowProps) => {
    let sections = [];
    let text = '';
    let fg = allProps.cells[0].fg;
    let bg = allProps.cells[0].bg;
    let idx = 0;
    for (let i = 0; i < allProps.cells.length; i++) {
        let cell = allProps.cells[i];
        if (cell.fg !== fg || cell.bg !== bg) {
            sections.push(<div key={idx++} className={['section', 'xterm-color-' + fg.toString(), 'xterm-bg-color-' + bg.toString()].join(' ')}>{text}</div>);
            text = cell.char;
            fg = cell.fg;
            bg = cell.bg;
        } else {
            text += cell.char;
        }
    }
    sections.push(<div key={idx} className={['section', 'xterm-color-' + fg.toString(), 'xterm-bg-color-' + bg.toString()].join(' ')}>{text}</div>);
    return (
        <div className='row'>
            {sections}
        </div>
    );
}

export default Row;