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
		"project_id": "compass-ga-289614",
		"private_key_id": "45158815bc955daf0d19fde535b57f373791278c",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDguEE2e4KPWrK\nau4to0TFKEzZXiLg9uGWc+rZwFW+W8i3ND67e9EcIlsmiaKuf05rwR8O5HPvxJAl\nU1HPINPlDg0pFZkHiBQnDnG4uE+HgNLZUHE2j83tvR1ErUO+Ni6mAsgjVssunCDt\n++ILPdtcGgqrthvH8vfM22PeX+VWlYdizloh+ojr1E2jtwvRupZncRAi0J2AuBJC\n/6mcQRxKnCNbkekBsIELSVRmnoxnTRjTwhOU9xxh+sXy6reyxvRC8unMBcU2iYxZ\nh3jgeK5m+HWpVK2gElVMwxoi3bd+Peyjko/xyuLbOHaTet6l+mtC+oA4NMWYB703\nfSnUaYmXAgMBAAECggEAM32Inap3kqLSOTUoPUS+m94dPzIXpX/fsawdsfOBoXyy\nw+0yiFX3oJ07vE6LVcGZea+G6nkoP4FZJTtoVFCk/bJRrPxPLTiddhvLv4ZrC5jV\n7v3Mkz4UUgR4bNnk+Xdzma0p4IS/RitAUO0Bf0xvNTZ2kPqJHoPS11UAXFSNJdwN\n0JRW3HBeFbKP5rKQzqBd6TT6HugdE/V/N3qH0Apmmn71Z0hdQKFfPlwQ5c9bpE2Y\nTedyDrnyPo5b69uosXCxBoSsuCzQVo+kg2OKIKxDNVxOOWD8m9SMg5qGctE9rVan\nljfwfZxGYFRToHSCFrmpOGm8vxnL8EqEZOhDtz3iIQKBgQDgAz3witjelP4Y55h3\ntnBgRmBBh56obYDRDXRXMbQXpTZjjlg5Mt+iv5JR75TMgBXfeTaEJ3+3IdaerMOw\nNxfEmqnfz95rOSzWsDQm1fIUcyvjMCDaFw3X6wi+eoeh5sXNVb3VOe2xboBRFA1A\nLIV3T1pz91JQhrpHUctp2zQLLQKBgQDfbcVXXXnobMdKfVBcrTgbw6QCdedxEcD3\nkZhidLjw4GfTww3V4bPb3gcdBB24usLBGnmGb9bmKaWhKPgm6R+x1aVdU/7h3COH\n/khDUxuTV8YckFofZ01W4CuGePAXoUDfz2kCTdVr2o33CEu0fxjCFd9zxKxsfk+W\nD7+BNjvSUwKBgQCoF6atzfJoKxL0ayyMf/iZNZXa9kJGjkzAEcGAAErsB0vlrpVi\n7lrDi87m7skQHvjKxPD0f5MlPx4F2QvKObz7CTd5O0jh2nhb7MJlddr+H2IKSz4L\niIsZv0LDc7w876bzqmgVDS/gGVPuAwbiZcYMvh3YsPgydrZm9+iUWSkXTQKBgBJN\n0uHyZX9WEgmXNJMzGaqkn3YYJKrNsopVoi9GsrQBHmBp1WNVRz/W86w73xd4LWZW\nfeg2l1tpxAjs6098v7z47MA1lmb4euy0N0VUtKiggzlp1ghGlT5txQMSO1EkQ8VS\nH58xsy9Py1uWkWUrGGMmGZVJYnrM6kY36g9y2vnDAoGBAIh14he7Qq66Oz/MdGet\nolOrt+yLGvDBQp4eF6E59NgjpPcwNEZHQofACXYdlnvPMY5CNf44m0+P6vjQ/EyM\n50HZVdp88llGkNLoOwTG/q/M359swoxlfdtxlgHnZZb8EXVAeEOyAgUzeDZyxcqi\nxkowTIKx2zDCviX+uyEEJUFk\n-----END PRIVATE KEY-----\n",
		"client_email": "compass-admin@compass-ga-289614.iam.gserviceaccount.com",
		"client_id": "114068190375801630658",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compass-admin%40compass-ga-289614.iam.gserviceaccount.com"
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
		"project_id": "compass-ga-289614",
		"private_key_id": "45158815bc955daf0d19fde535b57f373791278c",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDguEE2e4KPWrK\nau4to0TFKEzZXiLg9uGWc+rZwFW+W8i3ND67e9EcIlsmiaKuf05rwR8O5HPvxJAl\nU1HPINPlDg0pFZkHiBQnDnG4uE+HgNLZUHE2j83tvR1ErUO+Ni6mAsgjVssunCDt\n++ILPdtcGgqrthvH8vfM22PeX+VWlYdizloh+ojr1E2jtwvRupZncRAi0J2AuBJC\n/6mcQRxKnCNbkekBsIELSVRmnoxnTRjTwhOU9xxh+sXy6reyxvRC8unMBcU2iYxZ\nh3jgeK5m+HWpVK2gElVMwxoi3bd+Peyjko/xyuLbOHaTet6l+mtC+oA4NMWYB703\nfSnUaYmXAgMBAAECggEAM32Inap3kqLSOTUoPUS+m94dPzIXpX/fsawdsfOBoXyy\nw+0yiFX3oJ07vE6LVcGZea+G6nkoP4FZJTtoVFCk/bJRrPxPLTiddhvLv4ZrC5jV\n7v3Mkz4UUgR4bNnk+Xdzma0p4IS/RitAUO0Bf0xvNTZ2kPqJHoPS11UAXFSNJdwN\n0JRW3HBeFbKP5rKQzqBd6TT6HugdE/V/N3qH0Apmmn71Z0hdQKFfPlwQ5c9bpE2Y\nTedyDrnyPo5b69uosXCxBoSsuCzQVo+kg2OKIKxDNVxOOWD8m9SMg5qGctE9rVan\nljfwfZxGYFRToHSCFrmpOGm8vxnL8EqEZOhDtz3iIQKBgQDgAz3witjelP4Y55h3\ntnBgRmBBh56obYDRDXRXMbQXpTZjjlg5Mt+iv5JR75TMgBXfeTaEJ3+3IdaerMOw\nNxfEmqnfz95rOSzWsDQm1fIUcyvjMCDaFw3X6wi+eoeh5sXNVb3VOe2xboBRFA1A\nLIV3T1pz91JQhrpHUctp2zQLLQKBgQDfbcVXXXnobMdKfVBcrTgbw6QCdedxEcD3\nkZhidLjw4GfTww3V4bPb3gcdBB24usLBGnmGb9bmKaWhKPgm6R+x1aVdU/7h3COH\n/khDUxuTV8YckFofZ01W4CuGePAXoUDfz2kCTdVr2o33CEu0fxjCFd9zxKxsfk+W\nD7+BNjvSUwKBgQCoF6atzfJoKxL0ayyMf/iZNZXa9kJGjkzAEcGAAErsB0vlrpVi\n7lrDi87m7skQHvjKxPD0f5MlPx4F2QvKObz7CTd5O0jh2nhb7MJlddr+H2IKSz4L\niIsZv0LDc7w876bzqmgVDS/gGVPuAwbiZcYMvh3YsPgydrZm9+iUWSkXTQKBgBJN\n0uHyZX9WEgmXNJMzGaqkn3YYJKrNsopVoi9GsrQBHmBp1WNVRz/W86w73xd4LWZW\nfeg2l1tpxAjs6098v7z47MA1lmb4euy0N0VUtKiggzlp1ghGlT5txQMSO1EkQ8VS\nH58xsy9Py1uWkWUrGGMmGZVJYnrM6kY36g9y2vnDAoGBAIh14he7Qq66Oz/MdGet\nolOrt+yLGvDBQp4eF6E59NgjpPcwNEZHQofACXYdlnvPMY5CNf44m0+P6vjQ/EyM\n50HZVdp88llGkNLoOwTG/q/M359swoxlfdtxlgHnZZb8EXVAeEOyAgUzeDZyxcqi\nxkowTIKx2zDCviX+uyEEJUFk\n-----END PRIVATE KEY-----\n",
		"client_email": "compass-admin@compass-ga-289614.iam.gserviceaccount.com",
		"client_id": "114068190375801630658",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compass-admin%40compass-ga-289614.iam.gserviceaccount.com"
	}
	`

	analyticsReportingService, err := analyticsreporting.NewService(ctx, option.WithCredentialsJSON([]byte(serviceAccountJSON)))
	if err != nil {
		return nil, err
	}

	batchGetCall := analyticsReportingService.Reports.BatchGet(&analyticsreporting.GetReportsRequest{
		ReportRequests: []*analyticsreporting.ReportRequest{
			{
				ViewId: "228901918",
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
