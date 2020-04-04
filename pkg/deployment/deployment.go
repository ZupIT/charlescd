package deployment

const (
	StatusRunning       = "RUNNING"
	StatusSucceeded     = "SUCCEEDED"
	StatusWebhookFailed = "WEBHOOK_FAILED"
	StatusFailed        = "FAILED"
)

type Version struct {
	Version    string `json:"version"`
	VersionURL string `json:"versionUrl"`
}

type GitAccount struct {
	Provider string `json:"provider"`
	Token    string `json:"token"`
}

type Deployment struct {
	Name           string                 `json:"appName"`
	Namespace      string                 `json:"appNamespace"`
	Versions       []*Version             `json:"versions"`
	UnusedVersions []*Version             `json:"unusedVersions"`
	Webhook        string                 `json:"webhookUrl"`
	HelmRepository string                 `json:"helmUrl"`
	GitAccount     GitAccount             `json:"git"`
	Istio          map[string]interface{} `json:"istio"`
	CircleID       string                 `json:"circleId"`
	Kubeconfig     *string                `json:"kubeconfig"`
}
