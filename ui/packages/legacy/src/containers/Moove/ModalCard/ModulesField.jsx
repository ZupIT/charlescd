/* eslint-disable */
import React, { useState } from 'react'
import { ContentLayer, Translate, DropdownMenu } from 'components'
import PlusWithBorder from 'core/assets/svg/plusWithBorder.svg'
import { injectIntl } from 'react-intl'
import { SIZE } from 'components/Button'
import { Select } from 'components/Form'
import Tag from 'components/Tag'
import OutsideClickHandler from 'react-outside-click-handler'
import map from 'lodash/map'
import { i18n } from 'core/helpers/translate'
import FlashIcon from 'core/assets/svg/flash.svg'
import GithubIcon from 'core/assets/svg/github.svg'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import { StyledMoove } from '../styled'
import { Styled } from './styled'


const renderCard = ({ name, id }, onRemoveModule) => (
  <Styled.Item key={id}>
    <Tag
      icon={<GithubIcon />}
      action={(
        <DropdownMenu
          dark
          options={[
            { label: 'general.remove', action: () => onRemoveModule(id) },
          ]}
        />
      )}
    >
      <Translate id={name} />
    </Tag>
  </Styled.Item>
)

const renderModules = (card, onRemoveModule) => (
  <Styled.Items>
    { map(card.feature?.modules, module => renderCard(module, onRemoveModule)) }
  </Styled.Items>
)

const renderSelect = (
  intl,
  modules,
  selectValue,
  setSelectValue,
  onAddModule,
  toggleModuleSelect,
) => {
  return (
    <Styled.Item>
      <OutsideClickHandler
        display="flex"
        onOutsideClick={() => {
          toggleModuleSelect(false)
        }}
      >
        <Select onChange={e => setSelectValue(e.target.value)} name="buildId">
          <option value="select">{i18n(intl, 'general.dashed.select')}</option>
          { map(modules, (option, index) => (
            <option key={index} value={option.id}> { option.name } </option>
          ))}
        </Select>
        <StyledMoove.ModulesAddButton
          size={SIZE.SMALL}
          onClick={() => {
            if (selectValue && selectValue !== 'select') {
              onAddModule(selectValue)
              setSelectValue(null)
            }
          }}
        >
          <Translate id="general.add" />
        </StyledMoove.ModulesAddButton>
      </OutsideClickHandler>
    </Styled.Item>
  )
}

const ModulesField = (props) => {
  const { intl, modules, toggleModuleSelect, card, showModuleSelect, onAddModule, onRemoveModule } = props
  const [selectValue, setSelectValue] = useState(null)
  const alreadyChooseModules = map(card.feature?.modules, module => module.id)
  const possibleModules = filter(modules.content, ({ id }) => !alreadyChooseModules.includes(id))

  return !isEmpty(card) && (
    <ContentLayer icon={<FlashIcon />} margin="0 0 40px">
      <Styled.ViewTitle text="general.modules" />
      <Styled.Module.Wrapper>
        <Styled.SpaceBetween>
          <StyledMoove.View.ButtonAdd
            size={SIZE.SMALL}
            onClick={() => toggleModuleSelect(true)}
          >
            <StyledMoove.View.Icon>
              <PlusWithBorder />
            </StyledMoove.View.Icon>
          </StyledMoove.View.ButtonAdd>
        </Styled.SpaceBetween>
        <Styled.Module.Wrapper>
          { showModuleSelect && renderSelect(
            intl,
            possibleModules,
            selectValue,
            setSelectValue,
            onAddModule,
            toggleModuleSelect,
          )}
          { !showModuleSelect && renderModules(card, onRemoveModule)}
        </Styled.Module.Wrapper>
      </Styled.Module.Wrapper>
    </ContentLayer>
  )
}

export default injectIntl(ModulesField)
