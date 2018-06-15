import React, { Component } from 'react';

class Clock extends Component {

  constructor() {
    super();

    this.state = {
      now: null,
    };
  }

  componentDidMount() {
    // initialize get departures interval
    setInterval(() => {
      const date = new Date();
      this.setState({
        now: (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
        (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(),
      });
    }, 1000)
  }

  render() {
    return(
      <span className={"time"}>{this.state.now}</span>
    );
  }
}

export default Clock;
