import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';
import _ from 'lodash';
import { Line, Chart } from 'react-chartjs-2';
import moment from 'moment';
import currencies from './supported-currencies.json';
import logo from './logo.svg';

console.log(currencies)

const REALTIME_BITCOIN_URL = "https://api.coindesk.com/v1/bpi/currentprice.json"

class App extends Component {
  constructor (props) {
    super(props)

    // chart.js defaults
    Chart.defaults.global.defaultFontColor = '#000';
    Chart.defaults.global.defaultFontSize = 16;

    this.state = {historicalData: null, currency: "AUD"}
    this.onCurrencySelect = this.onCurrencySelect.bind(this)
  }

  componentDidMount () {
    this.getBitcoinData(),
    this.getRealtimeData()
  }

  getBitcoinData () {
    fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${this.state.currency}`)
      .then(response => response.json())
      .then(historicalData => this.setState({historicalData}))
      .catch(e => e)
  }
    
  getRealtimeData () {
    fetch(`https://api.coindesk.com/v1/bpi/currentprice/${this.state.currency}.json`)
      .then(response => response.json())
      .then(realtimeData => this.setState({realtimeData}))
      .catch(e => e)
  }

  formatChartData () {
    const {bpi} = this.state.historicalData

    return {
      labels: _.map(_.keys(bpi), date => moment(date).format("ll")),
      datasets: [
        {
          label: "Bitcoin",
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: _.values(bpi)
        }
      ]
    }
  }

  setCurrency (currency) {
    this.setState({currency}, this.getBitcoinData),
    this.setState({currency}, this.getRealtimeData)
  }

  onCurrencySelect (e) {
    this.setCurrency(e.target.value)
  }

  render() {
    if (this.state.historicalData) {
      return (
        <div className="app">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <Header title="BITCOIN PRICE INDEX" />

          <div className="select-container">
            <span style={{fontSize: 18, fontFamily: 'Bungee'}}>Select your currency: </span>
            <select value={this.state.currency} onChange={this.onCurrencySelect}>
              {currencies.map((obj, index) =>
                <option key={`${index}-${obj.country}`} value={obj.currency}> {obj.currency} </option>
              )}
            </select>
            {
              this.state.currency !== 'AUD' && (<div>
                <a href="#" className="link" onClick={() => this.setCurrency('AUD')} style={{color: "black", fontSize: 16, fontFamily: 'Bungee'}}> [CLICK HERE TO RESET] </a>
              </div>)
            }
          </div>

          <div style={{marginTop: 10}}>
            <Line data={this.formatChartData()} height={250} />
          </div>
        </div>
      )
    }

    return null
  }
}

export default App;
