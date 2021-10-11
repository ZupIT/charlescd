/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package main

import (
	"github.com/joho/godotenv"
	"log"
)

func main() {
	godotenv.Load("./resources/.env")

	persistenceManager, err := prepareDatabase()
	if err != nil {
		log.Fatal(err)
	}

	serviceManager, err := prepareServices()
	if err != nil {
		log.Fatal(err)
	}

	server := newServer(persistenceManager, serviceManager)

	log.Fatalln(server.start("8080"))
}
