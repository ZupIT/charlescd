package io.charlescd.moove.legacy.moove.service

import com.google.gson.GsonBuilder
import feign.Request
import feign.Response
import io.charlescd.moove.commons.exceptions.IntegrationExceptionLegacy
import io.charlescd.moove.commons.exceptions.ThirdyPartyIntegrationExceptionLegacy
import io.charlescd.moove.legacy.moove.api.config.VillagerErrorDecoder
import org.junit.Test
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.ObjectOutputStream
import java.nio.charset.Charset
import java.util.*
import kotlin.test.assertFailsWith


class VillagerErrorDecodeTest {

    private val DEFAULT_CODE = "error";

    private val villagerErrorDecode = VillagerErrorDecoder(
    )

    @Test
    fun `when httpStatus 400, method should throw IllegalArgumentException`() {
        assertFailsWith<IllegalArgumentException> {
            villagerErrorDecode.decode(
                "villagerTest", generateResponse(400, DEFAULT_CODE)
            )
        }
    }

    @Test
    fun `when httpStatus 500 and code contains Thirdy, method should throw ThirdyPartyIntegrationExceptionLegacy`() {
        assertFailsWith<ThirdyPartyIntegrationExceptionLegacy> {
            villagerErrorDecode.decode(
                "villagerTest",generateResponse(500, "Thirdy")
            )
        }
    }

    @Test
    fun `when httpStatus 500 and code not contains Thirdy, method should throw IntegrationExceptionLegacy`() {
        assertFailsWith<IntegrationExceptionLegacy> {
            villagerErrorDecode.decode(
                "villagerTest",generateResponse(500, DEFAULT_CODE)
            )
        }
    }

    @Test
    fun `when httpStatus 502, method should throw IntegrationExceptionLegacy`() {
        assertFailsWith<IntegrationExceptionLegacy> {
            villagerErrorDecode.decode(
                "villagerTest",generateResponse(502, DEFAULT_CODE)
            )
        }
    }

    @Test
    fun `when httpStatus 503, method should throw IntegrationExceptionLegacy`() {
        assertFailsWith<IntegrationExceptionLegacy> {
            villagerErrorDecode.decode(
                "villagerTest",generateResponse(503, DEFAULT_CODE)
            )
        }
    }

    @Test
    fun `when httpStatus 504, method should throw IntegrationExceptionLegacy`() {
        assertFailsWith<IntegrationExceptionLegacy> {
            villagerErrorDecode.decode(
                "villagerTest",generateResponse(504, DEFAULT_CODE)
            )
        }
    }

    @Test
    fun `when response is null, method should throw IntegrationExceptionLegacy`() {
        assertFailsWith<IntegrationExceptionLegacy> {
            villagerErrorDecode.decode(
                "villagerTest",null
            )
        }
    }

    private fun generateResponse(httpStatus: Int, code: String): Response? {
        return Response.builder()
            .request(generateRequest())
            .headers(generateHeaders())
            .reason("error")
            .body(generateResponseBody(code), Charset.defaultCharset())
            .status(httpStatus).build()
    }
    private fun generateResponseBody(code: String): String {
        val gson = GsonBuilder().create()
        return gson.toJson(VillagerErrorDecoder.ResponseError(code, "message"), VillagerErrorDecoder.ResponseError::class.java)
    }

    @Throws(IOException::class)
    private fun convertToBytes(`object`: Any): ByteArray? {
        ByteArrayOutputStream().use { bos ->
            ObjectOutputStream(bos).use { out ->
                out.writeObject(`object`)
                return bos.toByteArray()
            }
        }
    }

    private fun generateHeaders(): MutableMap<String, Collection<String>> {
        val headers: MutableMap<String, Collection<String>> = HashMap()
        headers.put("header", listOf("header"))
        return headers;
    }

    private fun generateRequest(): Request? {
        return Request.create(Request.HttpMethod.GET, "url", generateHeaders(), convertToBytes("request"), Charset.defaultCharset())
    }
}
