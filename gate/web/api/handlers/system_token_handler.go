package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	uuidPkg "github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func CreateSystemToken(createSystemToken systemTokenInteractor.CreateSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		var request representation.SystemTokenRequest
		bindErr := echoCtx.Bind(&request)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, logging.ParseError, nil))
		}

		validationErr := echoCtx.Validate(request)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "createSystemToken.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		var authorization = echoCtx.Request().Header.Get("Authorization")

		createdSystemToken, err := createSystemToken.Execute(authorization, request.RequestToDomain())
		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusCreated, representation.DomainToResponse(createdSystemToken))
	}
}
func GetSystemToken(getSystemToken systemTokenInteractor.GetSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		uuid, parseErr := uuidPkg.Parse(echoCtx.Param("id"))
		if parseErr != nil {
			logging.LogErrorFromCtx(ctx, parseErr)
			return echoCtx.JSON(http.StatusBadRequest, logging.NewError("Parse id failed", parseErr, logging.ParseError, nil))
		}

		systemToken, err := getSystemToken.Execute(uuid)
		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}
		return echoCtx.JSON(http.StatusOK, representation.DomainToResponse(systemToken))
	}
}




