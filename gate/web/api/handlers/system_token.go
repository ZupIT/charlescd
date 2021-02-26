package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
)

func GetAllSystemTokens(findAllSystemToken systemTokenInteractor.FindAllSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()

		page, err := strconv.Atoi(echoCtx.QueryParam("page"))
		if err != nil {
			return echoCtx.JSON(http.StatusBadRequest, err)
		}

		size, err := strconv.Atoi(echoCtx.QueryParam("size"))
		if err != nil {
			return echoCtx.JSON(http.StatusBadRequest, err)
		}

		systemTokens, err := findAllSystemToken.Execute(page, size)
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.PageSystemTokenToPageResponse(systemTokens))
	}
}
