// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/TranslationQuestion.css'
// Main
import Mark from "./Mark"
import {submitForMarkingButton, continueButton} from "./Question"

export default class TranslationQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            markResult: Mark.UNMARKED,
            currentAnswer: "",
            correctionPrompt: false,
            corrected: false
        }
    }

    mark(answer) {
        if (answer === "") {
            return Mark.UNMARKED
        } else if (answer === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    submitForMarkingButton() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.
        const markResult = this.mark(this.state.currentAnswer)

        // Issue
        // It is inefficient to be re-rendering the submitForMarkingButton everytime the currentAnswer changes
        let setMark
        if (markResult === Mark.CORRECT) {
            setMark = () => {setState({markResult: Mark.CORRECT})}
        } else if (markResult === Mark.INCORRECT) {
            setMark = () => {
                setState({
                    markResult: Mark.INCORRECT,
                    correctionPrompt: true
                })
            }
        }

        return submitForMarkingButton(setMark)
    }

    button() {
        if (this.state.markResult === Mark.UNMARKED) {
            return this.submitForMarkingButton()
        } else if (this.state.markResult === Mark.CORRECT || this.state.corrected) {
            return continueButton(this.props.completionListener, true)
        } else {
            return continueButton(() => {}, false)
        }
    }

    questionTitle() {
        let prompt = null
        if (this.state.correctionPrompt) {
            prompt = (
                <div>
                    <span id="correction-prompt">Type out the correct answer</span>
                    <span id="correction-answer">{this.props.q.answer}</span>
                </div>
            )
        }
        return (
            <div id="question-title" key="question-title">
                <span id="question-title-instruction">What is the translation of</span>
                <span id="question-title-given">{this.props.q.given}</span>
                <span id={this.state.markResult.id}>
                    <img src={this.state.markResult.img} className="question-result" alt="mark-result-status" />
                </span>
                {prompt}
            </div>
        )
    }

    answerInputTextBox() {
        let onChange
        if (this.state.correctionPrompt) {
            onChange = (event) => {
                if (event.target.value === this.props.q.answer) {
                    this.setState({
                        currentAnswer: event.target.value,
                        corrected: true
                    })
                }
            }
        } else {
            onChange = (event) => {this.setState({currentAnswer: event.target.value})}
        }
        return (
            <textarea id="answer-input-textbox" rows="5" cols="50" key="answer-input-textbox"
                      onChange={onChange}/>
        )
    }

    render() {
        return [
            <br key="header--break--question-title"/>,

            this.questionTitle(),

            <br key="question-title--break--textarea"/>,

            this.answerInputTextBox(),

            <div key="textarea--break--submit-button">
                <br />
            </div>,

            this.button()
        ]
    }
}