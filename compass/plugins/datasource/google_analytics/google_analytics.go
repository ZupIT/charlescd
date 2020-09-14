package main

import (
	"compass/pkg/datasource"
	"context"
	"fmt"

	"google.golang.org/api/analytics/v3"
	"google.golang.org/api/analyticsreporting/v4"
	"google.golang.org/api/option"
)

type Configuration struct {
	APIKey string
}

func GetMetrics(datasourceConfiguration []byte) (datasource.MetricList, error) {
	ctx := context.Background()
	serviceAccountJSON := `
	{
		"type": "service_account",
		"project_id": "ga-example-cf9a0",
		"private_key_id": "8ea6082b261d004d3a5ca7bd891c868f2166131d",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRvMsH9o0HQ0MH\nkGXRMyPMu94Obcw2ZBQmV5sHx+mdJW1399QZufLBYEe4XMkslolhdwpTAa0/sh+n\nAr+21UHOJeOgN7gLkXqdtuS9fy2/wIjzFZE091VNQcGS+P2M2155DHTBsvrZXlbZ\ny+9LwnoLLbgHlqARElSonPyG7bJSyet6JkiRoxP+wZ2pIZcZ8IBdN00DVS+YqqMs\nvFMBIRb5jz0Jo+eUOL1GwlhXBPKKt+/DMomZr9CS/IPtQFIy7BIOQ9WKLbishvdS\ngf/dQuf0XZc5vZcoIaug/paXIYmOA80TbfZ1vdqM2mi5AXjtEnZUpu1mgyAZ8vVh\nowWp4pG9AgMBAAECggEAEXRSuTDtf6M7Ws/LiWNmIU2pJy5ABm7Btocn4bfjWy6Y\nM5muTw3IhAtNLKycGVfVywSrGUlUb66VL8LszXxl45AHp3e7m0raF3H3C0YgOor9\nWq16zhufP7SvNVn/T8+Zxx0gQlZwxdIyDCIKohVnLrL5U7hXTdRmszmNUnVJl9YL\nYlKeQ2yvhHWNco1kSZo2nn05r2SYGUVZ4m3E1+TyRBpTVoQVrvfPORhcXJxR8OQi\nYg/lSP5pj5tsJQXB2lz/1MncMevcho9Omj2t4uP/GUfL+EVp5huzsiNAY5J7CGgS\nGaF3D5Kv00LNDPKufRtaVevKxQxl3d0068oxIayBgQKBgQDz9LGgQkwY7ujoufDv\nq8F5ibWiwG6Hfm+VVbWSYZ/dsnWPR/dYpxdzPbwzgTjDEzLEjVp2pODhETNB/u2A\newdMKe4/EMEKas5w4lgBRFJnDxx+WjQT0YGfAyeucm5IQqPErTniBqmZhBQNzuBJ\nJV60n6pxKqkqDmeOp6mtYFB7DQKBgQDcF57fyeW401cRfb+WfG3pyRfz1MVyyYXp\ntT9My7rzMmt4lUw7a8rqDSyQjyu5sH/aF5pVkQhEjsntI9ZkcOIipsQgq408FWtN\n8itNhTsirYszV9JCTgHgmKG/jNygQV9aFd2ub49ymnDpzkLSGgn2B69hcI4Q+ahf\nQ3M/IokFcQKBgQDHowPE8NwTP1dsM9W+XGDM0+vHDxCkYsxveZ9H9gn8Q7E+mpcI\nflyLWwbrYyEPSmOuQzq3gr/gjtHSfQrgrE1Rf7LO+yfuHW9pI2D/UGjam5wmriyV\n10nq1Ysgj9Y93gLkzRlkJS2fSl2a2yPh1+oDh/HUACRFHVqTfBM3pWzW9QKBgGwu\nPAw5u+2mC7TwPzyjuo7gJiLWoZqzTVw7l3qS5ThmvwaNM+Q9LobupMoFZXOnOqCj\nW1vVpt+z47LpG5dRGQX5PIvmZsxypsSwVPKMmy2HadV5xEKM/0U7IL37afJnT4wD\nFWyJL1Qgb4GsvZFx9RV2X5EgduQHIuh4SexteDYxAoGANnvBAK7tmCWzQmN8utSB\nUCRlRI63XTt9gcchmP5P8BPB0iqiRU4riuoGbzGxEHieMeEk2fk568on5c2UzyCl\nJ+H4SDmnq7o+EXUBf7lOEjGodfmsCl3vpnkd1fr+5sDYIk2UVrNZ90lE6Dg88PXg\n+3SAJxK2AKTr+NU4AwllRVU=\n-----END PRIVATE KEY-----\n",
		"client_email": "compass@ga-example-cf9a0.iam.gserviceaccount.com",
		"client_id": "107625970373171168281",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compass%40ga-example-cf9a0.iam.gserviceaccount.com"
	}
	`

	analyticsService, err := analytics.NewService(ctx, option.WithCredentialsJSON([]byte(serviceAccountJSON)))
	if err != nil {
		return nil, err
	}

	metadataColumns := analyticsService.Metadata.Columns.List("ga")
	res, err := metadataColumns.Do()
	if err != nil {
		return nil, err
	}

	metrics := []string{}
	for _, item := range res.Items {
		metrics = append(metrics, item.Id)
	}

	return metrics, nil
}

func Query(datasourceConfiguration, query, period, interval []byte, filters []datasource.MetricFilter) ([]datasource.Value, error) {
	ctx := context.Background()
	serviceAccountJSON := `
	{
		"type": "service_account",
		"project_id": "ga-example-cf9a0",
		"private_key_id": "8ea6082b261d004d3a5ca7bd891c868f2166131d",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRvMsH9o0HQ0MH\nkGXRMyPMu94Obcw2ZBQmV5sHx+mdJW1399QZufLBYEe4XMkslolhdwpTAa0/sh+n\nAr+21UHOJeOgN7gLkXqdtuS9fy2/wIjzFZE091VNQcGS+P2M2155DHTBsvrZXlbZ\ny+9LwnoLLbgHlqARElSonPyG7bJSyet6JkiRoxP+wZ2pIZcZ8IBdN00DVS+YqqMs\nvFMBIRb5jz0Jo+eUOL1GwlhXBPKKt+/DMomZr9CS/IPtQFIy7BIOQ9WKLbishvdS\ngf/dQuf0XZc5vZcoIaug/paXIYmOA80TbfZ1vdqM2mi5AXjtEnZUpu1mgyAZ8vVh\nowWp4pG9AgMBAAECggEAEXRSuTDtf6M7Ws/LiWNmIU2pJy5ABm7Btocn4bfjWy6Y\nM5muTw3IhAtNLKycGVfVywSrGUlUb66VL8LszXxl45AHp3e7m0raF3H3C0YgOor9\nWq16zhufP7SvNVn/T8+Zxx0gQlZwxdIyDCIKohVnLrL5U7hXTdRmszmNUnVJl9YL\nYlKeQ2yvhHWNco1kSZo2nn05r2SYGUVZ4m3E1+TyRBpTVoQVrvfPORhcXJxR8OQi\nYg/lSP5pj5tsJQXB2lz/1MncMevcho9Omj2t4uP/GUfL+EVp5huzsiNAY5J7CGgS\nGaF3D5Kv00LNDPKufRtaVevKxQxl3d0068oxIayBgQKBgQDz9LGgQkwY7ujoufDv\nq8F5ibWiwG6Hfm+VVbWSYZ/dsnWPR/dYpxdzPbwzgTjDEzLEjVp2pODhETNB/u2A\newdMKe4/EMEKas5w4lgBRFJnDxx+WjQT0YGfAyeucm5IQqPErTniBqmZhBQNzuBJ\nJV60n6pxKqkqDmeOp6mtYFB7DQKBgQDcF57fyeW401cRfb+WfG3pyRfz1MVyyYXp\ntT9My7rzMmt4lUw7a8rqDSyQjyu5sH/aF5pVkQhEjsntI9ZkcOIipsQgq408FWtN\n8itNhTsirYszV9JCTgHgmKG/jNygQV9aFd2ub49ymnDpzkLSGgn2B69hcI4Q+ahf\nQ3M/IokFcQKBgQDHowPE8NwTP1dsM9W+XGDM0+vHDxCkYsxveZ9H9gn8Q7E+mpcI\nflyLWwbrYyEPSmOuQzq3gr/gjtHSfQrgrE1Rf7LO+yfuHW9pI2D/UGjam5wmriyV\n10nq1Ysgj9Y93gLkzRlkJS2fSl2a2yPh1+oDh/HUACRFHVqTfBM3pWzW9QKBgGwu\nPAw5u+2mC7TwPzyjuo7gJiLWoZqzTVw7l3qS5ThmvwaNM+Q9LobupMoFZXOnOqCj\nW1vVpt+z47LpG5dRGQX5PIvmZsxypsSwVPKMmy2HadV5xEKM/0U7IL37afJnT4wD\nFWyJL1Qgb4GsvZFx9RV2X5EgduQHIuh4SexteDYxAoGANnvBAK7tmCWzQmN8utSB\nUCRlRI63XTt9gcchmP5P8BPB0iqiRU4riuoGbzGxEHieMeEk2fk568on5c2UzyCl\nJ+H4SDmnq7o+EXUBf7lOEjGodfmsCl3vpnkd1fr+5sDYIk2UVrNZ90lE6Dg88PXg\n+3SAJxK2AKTr+NU4AwllRVU=\n-----END PRIVATE KEY-----\n",
		"client_email": "compass@ga-example-cf9a0.iam.gserviceaccount.com",
		"client_id": "107625970373171168281",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compass%40ga-example-cf9a0.iam.gserviceaccount.com"
	}
	`

	analyticsReportingService, err := analyticsreporting.NewService(ctx, option.WithCredentialsJSON([]byte(serviceAccountJSON)))
	if err != nil {
		return nil, err
	}

	batchGetCall := analyticsReportingService.Reports.BatchGet(&analyticsreporting.GetReportsRequest{
		ReportRequests: []*analyticsreporting.ReportRequest{
			{
				ViewId: "228784277",
				Metrics: []*analyticsreporting.Metric{
					{
						Alias: string(query),
					},
				},
			},
		},
	})
	if err != nil {
		return nil, err
	}

	res, err := batchGetCall.Do()
	if err != nil {
		return nil, err
	}

	b, err := res.MarshalJSON()
	if err != nil {
		return nil, err
	}

	fmt.Println(b)

	return nil, nil
}

func Result(datasourceConfiguration, query []byte, filters []datasource.MetricFilter) (float64, error) {
	return 0, nil
}
