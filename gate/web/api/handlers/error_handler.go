package handlers

import (
	"context"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/labstack/echo/v4"
	"net/http"
)

func HandlerError(echoCtx echo.Context, ctx context.Context, err error) error  {
	logging.LogErrorFromCtx(ctx, err)
	return echoCtx.JSON(getErrorStatusCode(logging.GetErrorType(err)), err)
}

func getErrorStatusCode(errType string) int {
	switch errType {
	case logging.ParseError, logging.IllegalParamError:
		return http.StatusBadRequest
	case logging.BusinessError:
		return http.StatusUnprocessableEntity
	case logging.NotFoundError:
		return http.StatusNotFound
	default:
		return http.StatusInternalServerError
	}
}
