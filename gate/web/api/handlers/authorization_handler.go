package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	authorizationInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	"github.com/labstack/echo/v4"
	"net/http"
)

func DoAuthorization(doAuthorization authorizationInteractor.DoAuthorization) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		var request representation.AuthorizationRequest
		bindErr := echoCtx.Bind(&request)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, logging.ParseError, nil))
		}

		validationErr := echoCtx.Validate(request)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "doAuthorization.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		var authorizationToken = echoCtx.Request().Header.Get("Authorization")
		var workspaceId = echoCtx.Request().Header.Get("x-workspace-id")

		err := doAuthorization.Execute(authorizationToken, workspaceId, request.RequestToInput())
		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
