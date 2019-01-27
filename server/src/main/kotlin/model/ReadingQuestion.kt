package model

import com.fasterxml.jackson.databind.JsonNode
import neo4j.Neo4jDatabaseAdaptor
import org.http4k.format.Jackson
import org.http4k.unquoted
import org.neo4j.driver.v1.types.Node

data class ReadingQuestion(val extract: String, val subquestions: List<ReadingSubQuestion>) : Question {
    private val json = Jackson

    override fun jsonify(questionIndex: Int): JsonNode {
        val subquestions = subquestions.mapIndexed { i, subquestion -> subquestion.jsonify(i) }
        return json {
            obj(
                "type" to number(2),
                "index" to number(questionIndex),
                "extract" to string(extract),
                "questions" to array(subquestions)
            )
        }
    }

    companion object {
        fun fromNeo4jNode(
            node: Node,
            adaptor: Neo4jDatabaseAdaptor,
            courseName: String,
            lessonName: String,
            lessonIndex: Int
        ): ReadingQuestion {
            val subQuestions = adaptor.readingSubQuestions(courseName, lessonName, lessonIndex)
            val extract = node["extractInline"].toString().unquoted()
            return ReadingQuestion(extract, subQuestions)
        }
    }
}