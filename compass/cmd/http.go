package main

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/web/api/handlers"
	middlewares2 "github.com/ZupIT/charlescd/compass/web/api/middlewares"
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
	httpServer.Use(middlewares2.ContextLogger)
	httpServer.Use(middlewares2.Logger)
	httpServer.Use(middlewares2.RequestLimiter)
	httpServer.Validator = buildCustomValidator()
	httpServer.Binder = echo.Binder(customBinder{})

	p := prometheus.NewPrometheus("echo", nil)
	p.Use(httpServer)

	return httpServer
}

func (s server) start(port string) error {
	s.registerRoutes()
	return s.httpServer.Start(fmt.Sprintf(":%s", port))
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
	s.httpServer.GET("/health", handlers.Health())
	s.httpServer.GET("/metrics", handlers.Metrics())

	api := s.httpServer.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			actionHandler := v1.Group("/actions")
			{
				actionHandler.GET("", handlers.List(s.pm.actionRepository))
				actionHandler.POST("", handlers.Create(s.pm.actionRepository))
				actionHandler.DELETE("/:actionId", handlers.Delete(s.pm.actionRepository))
			}
			datasourceHandler := v1.Group("/datasources")
			{
				datasourceHandler.GET("", handlers.FindAllByWorkspace(s.pm.datasourceRepository))
				datasourceHandler.POST("", handlers.CreateDatasource(s.pm.datasourceRepository))
				datasourceHandler.DELETE("/:datasourceID", handlers.DeleteDatasource(s.pm.datasourceRepository))
				datasourceHandler.GET("/:datasourceID/metrics", handlers.GetMetrics(s.pm.datasourceRepository))
				datasourceHandler.POST("/test-connection", handlers.TestConnection(s.pm.datasourceRepository))

			}
			metricsGroupHandler := v1.Group("/metrics-groups")
			{
				metricsGroupHandler.POST("", handlers.CreateMetricsGroup(s.pm.metricsGroupRepository))
				metricsGroupHandler.GET("", handlers.GetAll(s.pm.metricsGroupRepository))
				metricsGroupHandler.GET("/:metricGroupID", handlers.Show(s.pm.metricsGroupRepository))
				metricsGroupHandler.GET("/:metricGroupID/query", handlers.Query(s.pm.metricsGroupRepository))
				metricsGroupHandler.GET("/:metricGroupID}/result", handlers.Result(s.pm.metricsGroupRepository))
				metricsGroupHandler.PUT("/:metricGroupID", handlers.UpdateMetricsGroup(s.pm.metricsGroupRepository))
				metricsGroupHandler.PATCH("/:metricGroupID", handlers.UpdateName(s.pm.metricsGroupRepository))
				metricsGroupHandler.DELETE("/:metricGroupID", handlers.DeleteMetricsGroup(s.pm.metricsGroupRepository))
				v1.GET("/resume/metrics-groups", handlers.Resume(s.pm.metricsGroupRepository))
			}
			{
				metricsGroupHandler.POST("/:metricGroupID/metrics", handlers.CreateMetric(s.pm.metricRepository, s.pm.metricsGroupRepository))
				metricsGroupHandler.PUT("/:metricGroupID/metrics/:metricID", handlers.UpdateMetric(s.pm.metricRepository))
				metricsGroupHandler.DELETE("/:metricGroupID/metrics/:metricID", handlers.DeleteMetric(s.pm.metricRepository))
			}
			groupActionHandler := v1.Group("/group-actions")
			{
				groupActionHandler.POST("", handlers.CreateMetricsGroupAction(s.pm.metricsGroupAction))
				groupActionHandler.GET("/:metricgroupactionID", handlers.FindByID(s.pm.metricsGroupAction))
				groupActionHandler.PUT("/:metricgroupactionID", handlers.Update(s.pm.metricsGroupAction))
				groupActionHandler.DELETE("/:metricgroupactionID", handlers.DeleteMetricsGroupAction(s.pm.metricsGroupAction))
			}
			circleHandler := v1.Group("/circles")
			{
				circleHandler.GET("/:circleID/metrics-groups", handlers.ListMetricGroupInCircle(s.pm.metricsGroupRepository))
			}
			pluginHandler := v1.Group("/plugins")
			{
				pluginHandler.GET("", handlers.ListPlugins(s.pm.pluginRepository))
			}
		}
	}
}
