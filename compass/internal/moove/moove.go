/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package moove

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/google/uuid"
)

type User struct {
	util.BaseModel
	Email  string
	Name   string
	IsRoot bool
}

const permissionQuery = `
						SELECT permissions 
						FROM workspaces_user_groups 
						WHERE workspace_id = ? 
							AND user_group_id IN (SELECT user_group_id FROM user_groups_users WHERE user_id = ?)
						`

func (main Main) FindUserByEmail(email string) (User, error) {
	var user User
	db := main.Db.Find("email = ?", email).Scan(&user)
	if db.Error != nil {
		return User{}, db.Error
	}

	return user, nil
}

func (main Main) GetUserPermissions(userID, workspaceID uuid.UUID) ([]json.RawMessage, error) {
	permissions := make([]json.RawMessage, 0)

	db := main.Db.Select(permissionQuery, userID, workspaceID).Scan(&permissions)
	if db.Error != nil {
		return nil, db.Error
	}

	return permissions, nil
}
