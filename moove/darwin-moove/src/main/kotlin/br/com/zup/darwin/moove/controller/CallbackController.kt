/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.moove.request.callback.DeployCallbackRequest
import br.com.zup.darwin.moove.request.callback.VillagerCallbackRequest
import br.com.zup.darwin.moove.service.CallbackService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Callback Endpoints", tags = ["Callback"])
@RestController
@RequestMapping("/callback")
class CallbackController(private val callbackService: CallbackService) {

    @ApiOperation(value = "Build Villager Callback")
    @ApiImplicitParam(name = "callbackRequest", value = "Build Villager Callback", required = true, dataType = "VillagerCallbackRequest")
    @PostMapping("/villager/{buildId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun villagerBuildCallback(@PathVariable buildId: String, @Valid @RequestBody callbackRequest: VillagerCallbackRequest) =
        callbackService.villagerCallback(buildId, callbackRequest)

    @ApiOperation(value = "Deployment Callback")
    @ApiImplicitParam(name = "callbackRequest", value = "Deployment Callback", required = true, dataType = "DeployCallbackRequest")
    @PostMapping("/deploy/{deploymentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deploymentCallback(@PathVariable deploymentId: String, @Valid @RequestBody callbackRequest: DeployCallbackRequest){
        callbackService.deploymentCallback(deploymentId, callbackRequest)
    }

}