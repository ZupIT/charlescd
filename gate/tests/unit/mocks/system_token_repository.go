// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package mocks

import (
	domain "github.com/ZupIT/charlescd/gate/internal/domain"
	mock "github.com/stretchr/testify/mock"

	uuid "github.com/google/uuid"
)

// SystemTokenRepository is an autogenerated mock type for the SystemTokenRepository type
type SystemTokenRepository struct {
	mock.Mock
}

// Create provides a mock function with given fields: systemToken
func (_m *SystemTokenRepository) Create(systemToken domain.SystemToken) (domain.SystemToken, error) {
	ret := _m.Called(systemToken)

	var r0 domain.SystemToken
	if rf, ok := ret.Get(0).(func(domain.SystemToken) domain.SystemToken); ok {
		r0 = rf(systemToken)
	} else {
		r0 = ret.Get(0).(domain.SystemToken)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(domain.SystemToken) error); ok {
		r1 = rf(systemToken)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// FindAll provides a mock function with given fields: name, pageRequest
func (_m *SystemTokenRepository) FindAll(name string, pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error) {
	ret := _m.Called(name, pageRequest)

	var r0 []domain.SystemToken
	if rf, ok := ret.Get(0).(func(string, domain.Page) []domain.SystemToken); ok {
		r0 = rf(name, pageRequest)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.SystemToken)
		}
	}

	var r1 domain.Page
	if rf, ok := ret.Get(1).(func(string, domain.Page) domain.Page); ok {
		r1 = rf(name, pageRequest)
	} else {
		r1 = ret.Get(1).(domain.Page)
	}

	var r2 error
	if rf, ok := ret.Get(2).(func(string, domain.Page) error); ok {
		r2 = rf(name, pageRequest)
	} else {
		r2 = ret.Error(2)
	}

	return r0, r1, r2
}

// FindById provides a mock function with given fields: id
func (_m *SystemTokenRepository) FindById(id uuid.UUID) (domain.SystemToken, error) {
	ret := _m.Called(id)

	var r0 domain.SystemToken
	if rf, ok := ret.Get(0).(func(uuid.UUID) domain.SystemToken); ok {
		r0 = rf(id)
	} else {
		r0 = ret.Get(0).(domain.SystemToken)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uuid.UUID) error); ok {
		r1 = rf(id)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// FindByToken provides a mock function with given fields: token
func (_m *SystemTokenRepository) FindByToken(token string) (domain.SystemToken, error) {
	ret := _m.Called(token)

	var r0 domain.SystemToken
	if rf, ok := ret.Get(0).(func(string) domain.SystemToken); ok {
		r0 = rf(token)
	} else {
		r0 = ret.Get(0).(domain.SystemToken)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(token)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Update provides a mock function with given fields: systemToken
func (_m *SystemTokenRepository) Update(systemToken domain.SystemToken) error {
	ret := _m.Called(systemToken)

	var r0 error
	if rf, ok := ret.Get(0).(func(domain.SystemToken) error); ok {
		r0 = rf(systemToken)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// UpdateLastUsedAt provides a mock function with given fields: systemToken
func (_m *SystemTokenRepository) UpdateLastUsedAt(systemToken domain.SystemToken) error {
	ret := _m.Called(systemToken)

	var r0 error
	if rf, ok := ret.Get(0).(func(domain.SystemToken) error); ok {
		r0 = rf(systemToken)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// UpdateRevokeStatus provides a mock function with given fields: systemToken
func (_m *SystemTokenRepository) UpdateRevokeStatus(systemToken domain.SystemToken) error {
	ret := _m.Called(systemToken)

	var r0 error
	if rf, ok := ret.Get(0).(func(domain.SystemToken) error); ok {
		r0 = rf(systemToken)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}
