import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import EventListener, {withOptions} from 'react-event-listener';

import { Screen, IState } from './model';
import { 
    keyDown,
    keyUp,
    mouseDown,
    mouseUp,
    mouseMove,
    windowResize,
    viewportW,
    viewportH,
} from './logic';

import Row from './Row';


interface AppProps {
    screen: Screen;
    dispatch: Dispatch<{}>;
};

class App extends React.Component<AppProps, void> {
    getRowCol = (event: React.MouseEvent<HTMLElement>) => {
        let rect = event.currentTarget.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let row = Math.floor(y/this.props.screen.letterDim.height);
        let col = Math.floor(x/this.props.screen.letterDim.width);
        return {
            row,
            col,
        };
    }
    handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        let {row, col} = this.getRowCol(event);
        this.props.dispatch(mouseDown(event.button, row, col, event.timeStamp));
    }

    handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
        let {row, col} = this.getRowCol(event);
        this.props.dispatch(mouseUp(event.button, row, col, event.timeStamp));
    }

    handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        let {row, col} = this.getRowCol(event);
        this.props.dispatch(mouseMove(event.button, row, col, event.timeStamp));
    }

    handleResize = () => this.props.dispatch(windowResize(viewportW(), viewportH()))

    render() {
        let screenWidth = this.props.screen.dim.cols * this.props.screen.letterDim.width;
        let marginWidth = Math.floor((this.props.screen.viewportDim.width - screenWidth) / 2);
        if (marginWidth < 0) {
            marginWidth = 0;
        }
        return (
            <div className='flex-container' style={{marginLeft: marginWidth}}>
                <EventListener
                    target='window'
                    onResize={this.handleResize}
                />
                <div 
                        className='screen'
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onMouseMove={this.handleMouseMove}>
                    {
                        this.props.screen.cells.map((row, index) => {
                            return (
                                <Row
                                    key={index}
                                    cells={row}
                                />
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IState) => {
    return {
    screen: state.screen
}};

export default connect(mapStateToProps)(App);