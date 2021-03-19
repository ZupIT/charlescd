package mapper

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
)

func UserModelToDomain(user models.User) domain.User {
	return domain.User{
		ID:        user.ID,
		Name:      user.Name,
		PhotoUrl:  user.PhotoUrl,
		Email:     user.Email,
		IsRoot:    user.IsRoot,
		CreatedAt: user.CreatedAt,
		WorkspacesPermissions: nil, //TODO
	}
}