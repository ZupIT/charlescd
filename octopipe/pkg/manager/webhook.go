/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package manager

import (
	"bytes"
	"encoding/json"
	"net/http"
	pipelinePKG "octopipe/pkg/pipeline"

	log "github.com/sirupsen/logrus"
)

func (manager Manager) mountWebhookRequest(pipeline pipelinePKG.Pipeline, payload map[string]string) (*http.Request, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequest(pipeline.Webhook.Method, pipeline.Webhook.Url, bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	for key, value := range pipeline.Webhook.Headers {
		request.Header.Set(key, value)
	}

	return request, nil
}

func (manager Manager) triggerWebhook(pipeline pipelinePKG.Pipeline, payload map[string]string) {
	client := http.Client{}

	if pipeline.Webhook.Url == "" {
		log.WithFields(log.Fields{"function": "triggerWebhook", "url": pipeline.Webhook.Url}).Info("Not found url for trigger Webhook")
		return
	}

	request, err := manager.mountWebhookRequest(pipeline, payload)
	if err != nil {
		log.WithFields(log.Fields{"function": "triggerWebhookeStep", "error": err}).Error("Create request failed")
		return
	}

	log.WithFields(log.Fields{"function": "triggerWebhook", "url": pipeline.Webhook.Url}).Info("Start trigger webhook...")
	_, err = client.Do(request)
	if err != nil {
		log.WithFields(log.Fields{"function": "triggerWebhook", "error": err}).Error("Trigger webhook error!")
		return
	}

	log.WithFields(log.Fields{"function": "triggerWebhook", "url": pipeline.Webhook.Url}).Info("Trigger webhook success!")
}
