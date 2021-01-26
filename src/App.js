import React from "react"
import './App.css'
import BackgroundEarth from './start/BackgroundEarth'
import GameOn from './game/GameOn'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      allGames: [
        {
          game: "Capitals",
          startQuestion: "What is the capital of",
        },
        {
          game: "Flags",
          startQuestion: "What country does this flag belongs to?",
        },
        {
          game: "Population",
          startQuestion: "What is the population of",
        }
      ]
    };
  }

  componentDidMount() {
    fetch("https://restcountries.eu/rest/v2/all?fields=name;capital;population;flag")
      .then(res => res.json())
      .then(
        (result) => {
          result.map(el => {
            el.population = Math.round(el.population / 1000000).toLocaleString('en')
            if (el.capital === "") el.capital = "N/A"
            return ""
          })
          this.setState({ isLoaded: true, data: result })
        },
        (error) => this.setState({ isLoaded: true, error: error })
      )
  }

  render() {
    const {error, isLoaded} = this.state
    if (!isLoaded) {
      return (
        <div className="App">
          <BackgroundEarth />
          <div className="container inner">
            <h1>Loading...</h1>
          </div>
        </div>
      )
    } else if (isLoaded) {
      if (error) {
        return (
          <div className="App">
            <BackgroundEarth />
            <div className="container inner">
              <h1>Oups... Something went wrong, <br /><br />try to refresh <br />or <br />try again later.</h1>
              <p>More info about the error: {error}</p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="App">
            <GameOn props={this.state}/>
          </div>
        )
      }
    }
  }
}

export default App;
