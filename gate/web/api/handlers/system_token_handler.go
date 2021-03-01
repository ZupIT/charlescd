package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	uuidPkg "github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
)

func GetAllSystemTokens(getAllSystemToken systemTokenInteractor.GetAllSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()

		page, err := strconv.Atoi(echoCtx.QueryParam("page"))
		size, err := strconv.Atoi(echoCtx.QueryParam("size"))
		if err != nil {
			logging.LogErrorFromCtx(ctx, err)
			return echoCtx.JSON(http.StatusBadRequest, logging.NewError("Parse id failed", err, logging.ParseError, nil))
		}

		systemTokens, err := getAllSystemToken.Execute(page, size)
		if err != nil {
			return HandlerError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.PageSystemTokenToPageResponse(systemTokens))
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

		user, err := getSystemToken.Execute(uuid)
		if err != nil {
			return HandlerError(echoCtx, ctx, err)
		}
		return echoCtx.JSON(http.StatusOK, representation.SystemTokenToResponse(user))
	}
}




