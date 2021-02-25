package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	"github.com/labstack/echo/v4"
	"net/http"
)

func ListSystemTokens(findAllSystemToken systemTokenInteractor.FindAllSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()
		systemTokens, err := findAllSystemToken.Execute()
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		systemTokensResponse := make([]representation.SystemTokenResponse, 0)
		for _, systemToken := range systemTokens {
			systemTokensResponse = append(systemTokensResponse, representation.SystemTokenToResponse(systemToken))
		}

		return echoCtx.JSON(http.StatusOK, nil)
	}
}
