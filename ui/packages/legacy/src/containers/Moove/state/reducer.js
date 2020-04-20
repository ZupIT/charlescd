import { createReducer } from 'core/helpers/redux'
import remove from 'lodash/remove'
import filter from 'lodash/filter'
import { MOOVE_ACTION_TYPES } from './actions'

const initialState = {
  columns: null,
  card: null,
  build: null,
  modules: [],
  filtered: true,
  loading: {
    create: false,
    modules: false,
    card: false,
    build: false,
    column: false,
    comments: false,
    generatingRelease: false,
  },
}

const reducer = {
  [MOOVE_ACTION_TYPES.REMOVE_CARD_COLUMN](state, { cardId }) {
    filter(state.columns, (column) => {
      remove(column.cards, card => (card.id === cardId))
      remove(column.builds, card => (card.id === cardId))
    })

    return {
      ...state,
    }
  },
  [MOOVE_ACTION_TYPES.LOADED_COLUMNS](state, { columns: { board } }) {
    return {
      ...state,
      columns: board,
    }
  },
  [MOOVE_ACTION_TYPES.TOGGLE_CREATE_LOADING](state) {
    const { loading } = state

    return {
      ...state,
      loading: {
        ...loading,
        create: !loading.create,
      },
    }
  },
  [MOOVE_ACTION_TYPES.TOGGLE_MODULES_LOADING](state) {
    const { loading } = state

    return {
      ...state,
      loading: {
        ...loading,
        modules: !loading.modules,
      },
    }
  },
  [MOOVE_ACTION_TYPES.TOGGLE_CARD_LOADING](state) {
    const { loading } = state

    return {
      ...state,
      loading: {
        ...loading,
        card: !loading.card,
      },
    }
  },
  [MOOVE_ACTION_TYPES.TOGGLE_COLUMN_LOADING](state, { toggle }) {
    const { loading } = state

    return {
      ...state,
      loading: {
        ...loading,
        column: toggle,
      },
    }
  },
  [MOOVE_ACTION_TYPES.TOGGLE_COMMENTS_LOADING](state) {
    const { loading } = state

    return {
      ...state,
      loading: {
        ...loading,
        comments: !loading.comments,
      },
    }
  },
  [MOOVE_ACTION_TYPES.TOGGLE_GENERATING_RELEASE](state) {
    const { loading } = state

    return {
      ...state,
      loading: {
        ...loading,
        generatingRelease: !loading.generatingRelease,
      },
    }
  },
  [MOOVE_ACTION_TYPES.LOADED_CARD](state, { card }) {
    return {
      ...state,
      card,
    }
  },
  [MOOVE_ACTION_TYPES.LOADED_BUILD](state, { build }) {
    return {
      ...state,
      build,
    }
  },
  [MOOVE_ACTION_TYPES.LOADED_MODULES](state, { modules }) {
    const { content } = modules

    return {
      ...state,
      modules: content,
    }
  },
  [MOOVE_ACTION_TYPES.UPDATE_COLUMN_WITH_NEW_CARD](state, { card }) {
    const { columns } = state
    columns[0].cards.push({
      ...card,
      id: 'temporaryId',
      temporaryLoading: true,
    })

    return {
      ...state,
      columns,
    }
  },
  [MOOVE_ACTION_TYPES.UPDATE_COLUMN_WITHOUT_NEW_CARD](state) {
    const { columns } = state
    columns[0].cards.pop()

    return {
      ...state,
      columns,
    }
  },
  [MOOVE_ACTION_TYPES.UPDATE_TEAM_VALIDATION_WITH_NEW_CARD](state, { release }) {
    const { columns } = state
    columns[3].builds.unshift({
      tag: release.tagName,
      id: 'temporaryId',
      status: 'MERGING',
      deployments: [],
      features: [],
    })

    return {
      ...state,
      columns,
    }
  },
  [MOOVE_ACTION_TYPES.RESET]() {
    return initialState
  },
  [MOOVE_ACTION_TYPES.RESET_CARD](state) {
    return {
      ...state,
      card: initialState.card,
    }
  },
  [MOOVE_ACTION_TYPES.RESET_BUILD](state) {
    return {
      ...state,
      build: initialState.build,
    }
  },
}

export default createReducer(initialState, reducer)
