package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
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
		if err != nil {
			page = 0
		}
		size, err := strconv.Atoi(echoCtx.QueryParam("size"))
		if err != nil {
			size = 20
		}
		sort := echoCtx.QueryParam("sort")
		if sort == "" {
			sort = "created_at desc"
		}
		pageRequest := domain.Page{
			Page: page,
			Size: size,
			Sort: sort,
		}

		systemTokens, pageRequest, err := getAllSystemToken.Execute(pageRequest)
		if err != nil {
			return HandlerError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.SystemTokenToPageResponse(systemTokens, pageRequest))
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
