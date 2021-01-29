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
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
)

type User struct {
	util.BaseModel
	Email  string
	Name   string
	IsRoot bool
}

type Permission struct {
	Name string
}

type PermissionsResult struct {
	Permissions json.RawMessage
}

const permissionQuery = `
						SELECT permissions 
						FROM workspaces_user_groups 
						WHERE workspace_id = ? 
							AND user_group_id IN (SELECT user_group_id FROM user_groups_users WHERE user_id = ?)
						`

func (main Main) FindUserByEmail(email string) (User, errors.Error) {
	user := User{}
	db := main.Db.Where("email = ?", email).First(&user)
	if db.Error != nil {
		return User{}, errors.NewError("Find error", db.Error.Error()).
			WithOperations("FindUserByEmail.First")
	}

	return user, nil
}

func (main Main) GetUserPermissions(userID, workspaceID uuid.UUID) ([]string, errors.Error) {
	rawPermissions := make([]PermissionsResult, 0)
	db := main.Db.Raw(permissionQuery, workspaceID, userID).Scan(&rawPermissions)
	if db.Error != nil {
		return nil, errors.NewError("Get error", db.Error.Error()).
			WithOperations("GetUserPermissions.Scan")
	}

	permsSet, err := getPermissionSet(rawPermissions)
	if err != nil {
		return nil, err
	}

	resultPerms := make([]string, 0)
	for perm := range permsSet {
		resultPerms = append(resultPerms, perm)
	}

	return resultPerms, nil
}

func getPermissionSet(rawPermissions []PermissionsResult) (map[string]bool, errors.Error) {
	permsMap := make(map[string]bool)
	for _, raw := range rawPermissions {
		perm := make([]Permission, 0)
		err := json.Unmarshal(raw.Permissions, &perm)
		if err != nil {
			return nil, errors.NewError("Get error", err.Error()).
				WithOperations("getPermissionSet.Unmarshal")
		}

		for _, singlePerm := range perm {
			permsMap[singlePerm.Name] = true
		}

	}

	return permsMap, nil
}
