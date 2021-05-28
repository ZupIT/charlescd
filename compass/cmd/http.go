package main

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/web/api/handlers"
	"github.com/ZupIT/charlescd/compass/web/middlewares"
	"github.com/casbin/casbin/v2"
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/go-playground/validator/v10/non-standard/validators"
	enTranslations "github.com/go-playground/validator/v10/translations/en"
	"github.com/labstack/echo-contrib/prometheus"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/leebenson/conform"
	"reflect"
	"strings"
)

type server struct {
	pm         persistenceManager
	sm         serviceManager
	httpServer *echo.Echo
	enforcer   *casbin.Enforcer
}

type customBinder struct{}

type CustomValidator struct {
	validator  *validator.Validate
	translator *ut.UniversalTranslator
}

func newServer(pm persistenceManager, sm serviceManager) (server, error) {
	enforcer, err := casbinEnforcer()
	if err != nil {
		return server{}, err
	}
	return server{
		pm:         pm,
		sm:         sm,
		httpServer: createHttpServerInstance(),
		enforcer:   enforcer,
	}, nil
}

func createHttpServerInstance() *echo.Echo {
	httpServer := echo.New()
	httpServer.Use(echoMiddleware.RequestID())
	httpServer.Use(middlewares.ContextLogger)
	httpServer.Use(middlewares.Logger)
	httpServer.Validator = buildCustomValidator()
	httpServer.Binder = echo.Binder(customBinder{})

	p := prometheus.NewPrometheus("echo", nil)
	p.Use(httpServer)

	return httpServer
}

func casbinEnforcer() (*casbin.Enforcer, error) {
	enforcer, err := casbin.NewEnforcer("./resources/auth.conf", "./resources/policy.csv")
	if err != nil {
		return nil, err
	}

	return enforcer, nil
}

func (cb customBinder) Bind(i interface{}, c echo.Context) (err error) {
	db := new(echo.DefaultBinder)
	if err = db.Bind(i, c); err != nil {
		return err
	}

	return conform.Strings(i)
}

func (cv *CustomValidator) Validate(i interface{}) error {
	err := cv.validator.Struct(i)
	if err != nil {
		return logging.NewValidationError(err, cv.translator)
	}

	return nil
}

func buildCustomValidator() *CustomValidator {
	v := validator.New()
	if err := v.RegisterValidation("notblank", validators.NotBlank); err != nil {
		return nil
	}
	v.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
	defaultLang := en.New()
	uniTranslator := ut.New(defaultLang, defaultLang)

	defaultTrans, _ := uniTranslator.GetTranslator("en")
	_ = enTranslations.RegisterDefaultTranslations(v, defaultTrans)

	return &CustomValidator{
		validator:  v,
		translator: uniTranslator,
	}
}

func (s server) registerRoutes() {
	authMiddleware := middlewares.NewAuthMiddleware(s.sm.mooveService, s.enforcer)

	s.httpServer.GET("/health", handlers.Health())
	s.httpServer.GET("/metrics", handlers.Metrics())
	api := s.httpServer.Group("/api")
	{
		v1 := api.Group("/v1")
		v1.Use(authMiddleware.Auth)
		{
			actionHandler := v1.Group("/actions")
			{
				actionHandler.GET("", handlers.List(s.pm.actionRepository))
				actionHandler.POST("", handlers.Create(s.pm.actionRepository))
				actionHandler.DELETE("/:actionId", handlers.Delete(s.pm.actionRepository))
			}
			datasourceHandler := v1.Group("/datasources")
			{
				datasourceHandler.GET("", handlers.FindAllByWorkspace(api.datasourceMain))
				datasourceHandler.POST("", handlers.CreateDatasource(api.datasourceMain))
				datasourceHandler.DELETE("/:datasourceID", handlers.DeleteDatasource(api.datasourceMain))
				datasourceHandler.GET("/:datasourceID/metrics", handlers.GetMetrics(api.datasourceMain))
				datasourceHandler.POST("/test-connection", handlers.TestConnection(api.datasourceMain))

			}
			metricsGroupHandler := v1.Group("/metrics-groups")
			{
				metricsGroupHandler.POST("", handlers.CreateMetricsGroup(api.metricsGroupMain))
				metricsGroupHandler.GET("", handlers.GetAll(api.metricsGroupMain))
				metricsGroupHandler.GET("/:metricGroupID", handlers.Show(api.metricsGroupMain))
				metricsGroupHandler.GET("/:metricGroupID/query", handlers.Query(api.metricsGroupMain))
				metricsGroupHandler.GET("/:metricGroupID}/result", handlers.Result(api.metricsGroupMain))
				metricsGroupHandler.PUT("/:metricGroupID", handlers.UpdateMetricsGroup(api.metricsGroupMain))
				metricsGroupHandler.PATCH("/:metricGroupID", handlers.UpdateName(api.metricsGroupMain)) // TODO: Discutir necessidade desse patch
				metricsGroupHandler.DELETE("/:metricGroupID", handlers.DeleteMetricsGroup(api.metricsGroupMain))
				v1.GET("/resume/metrics-groups", handlers.Resume(api.metricsGroupMain))
			}
			{
				metricsGroupHandler.POST("/:metricGroupID/metrics", handlers.CreateMetric(api.metricMain, api.metricsGroupMain))
				metricsGroupHandler.PUT("/:metricGroupID/metrics/:metricID", handlers.UpdateMetric(api.metricMain))
				metricsGroupHandler.DELETE(fmt.Sprintf("%s/{metricGroupID}/metrics/{metricID}", path), handlers.DeleteMetric(api.metricMain))
			}

			groupActionHandler := v1.Group("/group-actions")
			{
				groupActionHandler.POST("", handlers.CreateMetricsGroupAction(api.metricGroupActionMain))
				groupActionHandler.GET("/:metricgroupactionID", handlers.FindByID(api.metricGroupActionMain))
				groupActionHandler.PUT("/:metricgroupactionID", handlers.Update(api.metricGroupActionMain))
				groupActionHandler.DELETE("/:metricgroupactionID", handlers.DeleteMetricsGroupAction(api.metricGroupActionMain))
			}
			circleHandler := v1.Group("/circles")
			{
				circleHandler.GET("/:circleID/metrics-groups", handlers.ListMetricGroupInCircle(api.metricsGroupMain))
			}
			pluginHandler := v1.Group("/plugins")
			{
				pluginHandler.GET("", handlers.ListPlugins(api.pluginMain))
			}
		}
	}
}
