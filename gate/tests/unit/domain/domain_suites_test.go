package domain

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/stretchr/testify/suite"
	"testing"
)

type DomainSuite struct {
	suite.Suite
	page domain.Page
}

func (d *DomainSuite) SetupSuite() {
	d.page = domain.Page{}
}

func (d *DomainSuite) SetupTest() {
	d.SetupSuite()
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(DomainSuite))
}
