package io.charlescd.moove.legacy.moove.api.config

import com.google.gson.Gson
import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.IntegrationExceptionLegacy
import java.lang.IllegalArgumentException

class VillagerErrorDecoder : ErrorDecoder {
    override fun decode(methodKey: String?, response: Response?): Exception {
        response?.let {
            val fromJson = Gson().fromJson<ResponseError>(it.body().toString(), ResponseError::class.java)

            if (it.status() == 400) {
                throw IllegalArgumentException(fromJson.message);
            }

            throw IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, fromJson.message);
        }
        throw IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, "");
    }

    data class ResponseError (
        val message: String
    )
}
