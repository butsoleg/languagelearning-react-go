// React
import React, {Component} from "react";
// Resources
import '../styles/TranslationQuestion.css'
import greentick from '../images/greentick.png'
import redcross from '../images/redcross.png'
import greyquestionmark from '../images/greyquestionmark.png'

export default class TranslationQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            markResult: Mark.UNMARKED,
            currentAnswer: ""
        }
    }

    markAnswer(answer) {
        if (answer === "") {
            return Mark.UNMARKED
        } else if (answer === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    render() {
        return [
            <h1 id="question-title-instruction" key="question-title-instruction">Translate</h1>,
            <h1 id="question-title-given" key="question-title-given">{this.props.q.given}</h1>,
            <div key="question-result-mark" id={this.state.markResult.id}>
                <img src={this.state.markResult.img} alt="mark-result-status" width="100" height="100" />
            </div>,
            <input id="answer-input-textbox" key="answer-input-textbox" type="text"
                   onChange={(event) => {
                       this.setState({currentAnswer: event.target.value})
                    }}/>,
            <button id="submit-for-marking-button" key="submit-for-marking-button"
                    onClick={() => {
                        this.setState({markResult: this.markAnswer(this.state.currentAnswer)})
                    }}>
                Mark
            </button>
        ]
    }
}

let Mark = (() => {
    function Mark(id, img) {
        return {
            id: id,
            img: img
        }
    }

    return {
        UNMARKED:  Mark("question-result-unmarked",  greyquestionmark),
        CORRECT:   Mark("question-result-correct",   greentick),
        INCORRECT: Mark("question-result-incorrect", redcross)
    }
})()