package repository

import (
	"github.com/cassioHilario/rocketseat-go-react-na-pratica/app/domain/dao"
	"gorm.io/gorm"

	log "github.com/sirupsen/logrus"
)

type RoleRepository interface {
	FindAllRole() ([]dao.Role, error)
	FindRoleById(id int) (dao.Role, error)
	Save(role *dao.Role) (dao.Role, error)
	DeleteRoleById(id int) error
}

type RoleRepositoryImpl struct {
	db *gorm.DB
}

func (r RoleRepositoryImpl) FindAllRole() ([]dao.Role, error) {
	var roles []dao.Role

	var err = r.db.Find(&roles).Error
	if err != nil {
		log.Error("Got an error finding all roles. Error: ", err)
		return nil, err
	}

	return roles, nil
}

func (r RoleRepositoryImpl) FindRoleById(id int) (dao.Role, error) {
	role := dao.Role{
		ID: id,
	}
	err := r.db.First(&role).Error
	if err != nil {
		log.Error("Got and error when find role by id. Error: ", err)
		return dao.Role{}, err
	}
	return role, nil
}

func (r RoleRepositoryImpl) Save(role *dao.Role) (dao.Role, error) {
	var err = r.db.Save(role).Error
	if err != nil {
		log.Error("Got an error when save role. Error: ", err)
		return dao.Role{}, err
	}
	return *role, nil
}

func (r RoleRepositoryImpl) DeleteRoleById(id int) error {

	err := r.db.Delete(&dao.Role{}, id).Error
	if err != nil {
		log.Error("Got an error when delete role. Error: ", err)
		return err
	}
	return nil
}


func RoleRepositoryInit(db *gorm.DB) *RoleRepositoryImpl {
	db.AutoMigrate(&dao.Role{})
	return &RoleRepositoryImpl{
	 db: db,
	}
   }