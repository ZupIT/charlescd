package moove

import (
	"net/http"
	"time"
)

type APIClient struct {
	URL        string
	httpClient *http.Client
}

func NewAPIClient(url string, timeout time.Duration) APIClient {
	return APIClient{
		URL: url,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}
