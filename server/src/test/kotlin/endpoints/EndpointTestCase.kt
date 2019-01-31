package endpoints


import com.fasterxml.jackson.databind.JsonNode
import environment.EnvironmentLoader
import logger.ServerLogger
import neo4j.Neo4jDatabaseAdaptor
import neo4j.Neo4jDriver
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert
import org.http4k.client.JavaHttpClient
import org.http4k.core.Headers
import org.http4k.core.Method
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.format.Jackson
import org.http4k.server.Http4kServer
import org.http4k.unquoted
import org.junit.After
import org.junit.Before
import server.Server

open class EndpointTestCase {
    val environmentLoader = EnvironmentLoader(System::getenv)
    val environment = environmentLoader.getEnvironment()
    val neo4jDriver = Neo4jDriver(environment.neo4jUser, environment.neo4jPassword, environment.neo4jPort)
    val neo4jDatabaseAdaptor = Neo4jDatabaseAdaptor(
        neo4jDriver,
        environment.imagesPath,
        environment.extractsPath
    )

    val logger = ServerLogger()

    val server: Http4kServer = Server(
        environment.serverPort,
        neo4jDatabaseAdaptor,
        environment.frontendPort,
        logger
    )

    val client = JavaHttpClient()
    val serverUrl = "http://localhost:${environment.serverPort}"

    val json = Jackson

    @After
    fun tearDown() {
        server.stop()
        neo4jDriver.session().let { session ->
            session.run("MATCH (n) DETACH DELETE (n)")
            session.run("MATCH (n) DELETE (n)")
            session.close()
        }
    }

    @Before
    fun setUp() {
        server.start()
    }

    fun assertLessonHasIndex(lessonMetadata: JsonNode, lessonName: String, index: Int) {
        MatcherAssert.assertThat(
            getNodeWithName(lessonMetadata, lessonName)["index"].asInt(),
            CoreMatchers.equalTo(index)
        )
    }

    fun courseMetadataRequestJson(courseName: String): JsonNode {
        val response = courseMetadataRequest(courseName)
        return json.parse(response.bodyString())
    }

    fun courseMetadataRequest(courseName: String): Response {
        val request = Request(Method.GET, "${serverUrl}/coursemetadata?course=$courseName")
        return client.invoke(request)
    }

    fun headerValue(headers: Headers, headerName: String): String {
        return headers.first { header -> header.first == headerName }.second!!
    }

    fun assertHasHeader(response: Response, headerName: String, headerValue: String) {
        MatcherAssert.assertThat(
            headerValue(response.headers, headerName),
            CoreMatchers.equalTo(headerValue)
        )
    }

    fun coursesRequest(): Response {
        val request = Request(Method.GET, "${serverUrl}/courses")
        return client.invoke(request)
    }

    private fun getNodeWithName(lessonMetadata: JsonNode, nodeName: String): JsonNode {
        return lessonMetadata.first { node -> node["name"].toString().unquoted() == nodeName }
    }
}