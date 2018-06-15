import React, { Component } from 'react';
import './Filter.css';
import * as VBBApiActions from '../../../Actions/VBBApiActions';

class Filter extends Component {

  constructor(props) {
    super();

    this.state = {
      lines: props.lines || [],
    };
  }

  handleChangeFilter(checked, lineIndex) {
    let tmpLines = this.state.lines;
    tmpLines[lineIndex].include = checked;
    this.setState({
      lines: tmpLines,
    });

    let tmpDisplay = this.props.display;
    tmpDisplay.lines = this.state.lines;
    VBBApiActions.updateDisplay(this.props.index, tmpDisplay);
  }

  handleSelectAll(hasLinesSelected) {
    let tmpLines = this.state.lines;
    tmpLines.map((line) => {
      line.include = !hasLinesSelected;
      return line;
    });
    this.setState({
      lines: tmpLines,
    });
    if (!hasLinesSelected) {
      let tmpDisplay = this.props.display;
      tmpDisplay.lines = this.state.lines;
      VBBApiActions.updateDisplay(this.props.index, tmpDisplay);
    }
  }

  render() {
    const hasLinesSelected = !!(this.state.lines.filter((line) => {
      return line.include;
    }).length);

    return(
      <div className="dropdown">
        <button className="btn btn-sm btn-secondary-outline" type="button"
                data-toggle="collapse"
                data-target={'#filterCollapse_' + this.props.index}
                aria-expanded="false"
                aria-controls="filterCollapse">
          <i className="fas fa-filter"/>
        </button>

        <div className="collapse multi-collapse"
             id={'filterCollapse_' + this.props.index}>
          <div className="card card-body">
            {this.state.lines.map((line, index) => {
              return (
                <label className="label--checkbox" key={index}>
                  <input type="checkbox" className="checkbox"
                         checked={this.state.lines[index].include}
                         onChange={(e) => {
                           this.handleChangeFilter(e.target.checked, index)
                         }} />
                  {line.line} - {line.direction}
                </label>
              )
            })}
            <hr/>
            <button className={'btn btn-outline-dark btn-sm'} onClick={() => {this.handleSelectAll(hasLinesSelected)}}>
              {hasLinesSelected ? 'Select All' : 'Deselect All'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
