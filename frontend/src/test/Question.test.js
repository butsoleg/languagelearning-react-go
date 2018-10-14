// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import Question from '../main/Question'
// Enzyme react-adapter configuration & others
import {configureAdapter, textBoxInputEvent} from "./utils"

configureAdapter()

describe('Translation questions', () => {
    it('Shows the question of a translation question', () => {
        let q = {type: 0, given: "hello", answer: "გამარჯობა"}
        let testTQ = shallow(<Question q={q} />)

        let questionTitle = testTQ.find("#question-title")

        expect(questionTitle.text()).toBe("Translate \"hello\"")
    })

    it('Marks a correct answer as correct', () => {
        let q = {type: 0, given: "hello", answer: "გამარჯობა"}
        let testTQ = mount(<Question q={q} />)

        let inputBox = testTQ.find("#answer-input-textbox")
        let testInput = "გამარჯობა"
        inputBox.simulate("change", textBoxInputEvent(testInput))

        let markButton = testTQ.find("#submit-for-marking-button")
        markButton.simulate("click")

        expect(testTQ.find("#question-result-correct").exists()).toBe(true)
    })
})