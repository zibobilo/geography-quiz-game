import React from "react"
import BackgroundEarth from '../start/BackgroundEarth'

class GameOn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.props.data,
      allGames: this.props.props.allGames,
      home: true,
      inGame: false,
      gamePlaying: null,
      qN: 0,
      numberOfCorrectAnswers: 0,
      correctAnswer: "",
      correctTitle: "",
      possibleAnswers: [],
      correctFlagURL: null,
      goodAnswer: true
    }
  }

  playing(game) {
    this.setState({ gamePlaying: game }, this.nextQuestion)
    this.setState({ home: false, inGame: true })
  }

  generateI() {
    return Math.floor(Math.random() * this.state.data.length)
  }

  nextQuestion() {
    const { qN, gamePlaying, allGames } = this.state
    this.setState({ qN: qN + 1 })

    switch (gamePlaying) {
      case allGames[0].game:
        this.buildingQuizz("name", "capital")
        break;
      case allGames[1].game:
        this.buildingQuizz("flag", "name")
        break;
      case allGames[2].game:
        this.buildingQuizz("name", "population")
        break;
      default:
    }
  }

  buildingQuizz(question, answer) {
    const { data } = this.state
    let rightAnswer = this.generateI()

    let possibleAnswers = [data[rightAnswer][answer]]

    while (possibleAnswers.length < 4) {
      let test = this.generateI()
      if (!possibleAnswers.includes(data[test][answer])) possibleAnswers.push(data[test][answer]);
    }
    possibleAnswers.sort()
    this.setState({
      correctAnswer: data[rightAnswer][answer],
      correctTitle: data[rightAnswer][question],
      possibleAnswers: possibleAnswers
    })
  }

  evaluate(answer) {
    const { qN, correctAnswer, correctTitle, gamePlaying } = this.state
    answer === this.state.correctAnswer ? this.correctAnswer() : this.wrongAnswer()
    gamePlaying === "Flags" ?
      this.setState({
        correctResponse: `PREVIOUS QUESTION : ${correctAnswer}`,
        correctFlagURL: correctTitle
      })
    : this.setState({ correctResponse: `PREVIOUS QUESTION : ${correctTitle} => ${correctAnswer}` })

    !(qN % 10) && qN !== 0 ? this.setState({ inGame: false }) : this.nextQuestion()
  }

  correctAnswer() {
    this.setState({ numberOfCorrectAnswers: this.state.numberOfCorrectAnswers + 1, goodAnswer: true })
    new Audio("https://www.raphburk.com/wp-content/uploads/2020/03/message.wav").play()
  }

  wrongAnswer() {
    this.setState({ goodAnswer: false })
    new Audio("https://www.raphburk.com/wp-content/uploads/2020/03/thunder.wav").play()
  }

  render() {
    const { qN, home, inGame, allGames, gamePlaying, correctTitle, goodAnswer,
      correctResponse, possibleAnswers, numberOfCorrectAnswers, correctFlagURL } = this.state
    if (home) {
      return (
        <>
          <BackgroundEarth />
          <div className="container inner">
            <h1>WELCOME <br />TO THE ULTIMATE<br />GEOGRAPHY QUIZ</h1>
            <h2>What quiz would you like to play?</h2>
            {allGames.map(el => <button key={el.game} onClick={() => this.playing(el.game)}>{el.game}</button>)}
          </div>
        </>
      )
    } else if (inGame && gamePlaying === allGames[1].game) {
      return (
        <div className="container inner">
          <h1>{gamePlaying}: Question {qN}</h1>
          <h2>{allGames[1].startQuestion}</h2>
          <img alt="Quizz flag" src={correctTitle}></img>
          <div id="buttons">
            {possibleAnswers.map((el, i) => <button key={el} onClick={() => this.evaluate(el, i)}>{el}</button>)}
          </div>
          {(qN - 1) % 10 ?
            <>
              <div className={goodAnswer ? "correct" : "wrong"}>{correctResponse}
              </div>
              <img alt="Quizz flag" style={{ width: "80px" }} src={correctFlagURL}></img>
              <div>Your score is {numberOfCorrectAnswers}/{qN - 1}</div>
            </>
            : <></>}
        </div>
      )
    } else if (inGame) {
      return (
        <div className="container inner">
          <h1> {gamePlaying}: Question {qN}</h1>
          <h2>
            {gamePlaying === allGames[0].game ? allGames[0].startQuestion : allGames[2].startQuestion}<b> {correctTitle}?</b>

            {gamePlaying === allGames[2].game && <><br />Rounded in Millions</>}
          </h2>
          <div id="buttons">
            {possibleAnswers.map((el, i) => <button key={el} onClick={() => this.evaluate(el, i)}>{el}</button>)}
          </div>
          {(qN - 1) % 10 ?
            <>
              <div className={goodAnswer ? "correct" : "wrong"}>
                {correctResponse}
              </div>
              <div>Your score is {numberOfCorrectAnswers}/{qN - 1}</div>
            </> : <></>}
        </div>
      )
    } else if (!inGame) {
      new Audio("https://www.raphburk.com/wp-content/uploads/2020/03/checkpoint.wav").play()
      return (
        <div className="container inner">
          <h1>Bravo!<br />
          You finished the test!
        </h1>
          <h2>Your Score is <b>{numberOfCorrectAnswers}/{qN}</b></h2>
          <h3>Are you ready for 10 more questions?</h3>
          <div id="buttons">
            {allGames.map(el => <button key={el.game} onClick={() => this.playing(el.game)}>{el.game}</button>)}
          </div>
          <div className={goodAnswer ? "correct" : "wrong"}>{correctResponse}</div>
        </div>
      )
    }
  }
}

export default GameOn
