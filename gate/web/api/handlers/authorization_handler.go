package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	authorizationInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/authorization"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	"github.com/labstack/echo/v4"
	"net/http"
)

func DoAuthorization(authorizeUserToken authorizationInteractor.AuthorizeUserToken, authorizeSystemToken authorizationInteractor.AuthorizeSystemToken) echo.HandlerFunc {
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
			validationErr = logging.WithOperation(validationErr, "authorizeUserToken.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		var systemToken = echoCtx.Request().Header.Get("x-charles-token")
		var workspaceId = echoCtx.Request().Header.Get("x-workspace-id")

		if systemToken != "" {
			err := authorizeSystemToken.Execute(systemToken, workspaceId, request.RequestToDomain())
			if err != nil {
				return HandleError(echoCtx, ctx, err)
			}
		} else {
			var userToken = echoCtx.Request().Header.Get("Authorization")

			err := authorizeUserToken.Execute(userToken, workspaceId, request.RequestToDomain())
			if err != nil {
				return HandleError(echoCtx, ctx, err)
			}
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
