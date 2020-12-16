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

import { useCallback, useEffect, useState } from 'react';
import {
  findBoardByHypothesisId,
  moveCardBetweenBoard,
  orderCardInBoard,
  generateBuild
} from 'core/providers/hypothesis';
import {
  findById,
  updateById,
  deleteById,
  addCardMembers,
  createCard as createCardRequest,
  Payload,
  archiveById
} from 'core/providers/card';
import {
  useFetch,
  FetchProps,
  FetchStatuses,
  useFetchData
} from 'core/providers/base/hooks';
import { Payload as CardPayload } from 'core/providers/card';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { setBoard } from 'modules/Hypotheses/state/actions';
import { useDispatch } from 'core/state/hooks';
import { Column, Card, CardMovement, NewRelease } from './interfaces';

interface BoardFetchProps extends FetchProps {
  movingCard: Function;
  reorderColumn: Function;
}

export const useBoard = (): BoardFetchProps => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const getBoard = useFetchData<{ board: Column[] }>(findBoardByHypothesisId);
  const [, moveCard] = useFetch(moveCardBetweenBoard);
  const [, orderCard] = useFetch(orderCardInBoard);
  const [fetchedBoard, setFetchedBoard] = useState(null);

  const getAll = useCallback(
    async (id: string) => {
      try {
        if (id) {
          setStatus('pending');
          const res = await getBoard(id);

          setFetchedBoard(res?.board);
          dispatch(setBoard(res?.board));

          setStatus('resolved');

          return res;
        }
      } catch (e) {
        setStatus('rejected');
      }
    },
    [getBoard, dispatch]
  );

  const movingCard = useCallback(
    (hypothesisId: string, cardId: string, payload: CardMovement) => {
      moveCard(hypothesisId, cardId, payload);
    },
    [moveCard]
  );

  const reorderColumn = useCallback(
    (hypothesisId: string, payload: Column) => {
      orderCard(hypothesisId, payload);
    },
    [orderCard]
  );

  return {
    getAll,
    movingCard,
    reorderColumn,
    loadingAll: status === 'pending',
    responseAll: fetchedBoard
  };
};

interface Props extends FetchProps {
  getById: Function;
  removeById: Function;
  archiveBy: Function;
}

interface AddMemberProps {
  loading: boolean;
  addMembers: Function;
}

export const useAddMember = (): AddMemberProps => {
  const [data, addMembersToCard] = useFetch(addCardMembers);
  const { loading } = data;

  const addMembers = useCallback(
    (cardId: string, authorId: string, memberIds: string[]) => {
      addMembersToCard(cardId, authorId, memberIds);
    },
    [addMembersToCard]
  );

  return {
    loading,
    addMembers
  };
};

interface AddModuleProps {
  status: FetchStatuses;
  persistModules: (cardId: string, payload: CardPayload) => void;
}

export const useModules = (): AddModuleProps => {
  const dispatch = useDispatch();
  const [, , updateCard] = useFetch(updateById);
  const [status, setStatus] = useState<FetchStatuses>('idle');

  const persistModules = useCallback(
    async (cardId: string, payload: CardPayload) => {
      try {
        setStatus('pending');
        await updateCard(cardId, payload);
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
        const error = await e.json();
        dispatch(
          toogleNotification({
            text: `[${error.status}] This module could not be tied.`,
            status: 'error'
          })
        );
      }
    },
    [updateCard, dispatch]
  );

  return {
    status,
    persistModules
  };
};

export const useCard = (): Props => {
  const dispatch = useDispatch();
  const [card, getCard] = useFetch<Card>(findById);
  const [removedCard, removeCard] = useFetch(deleteById);
  const [archivedCard, archiveCard] = useFetch(archiveById);
  const [updateResponse, updateCard] = useFetch(updateById);
  const { response, loading, error } = card;
  const {
    response: responseRemove,
    error: errorRemove,
    loading: loadingRemove
  } = removedCard;
  const { response: responseArchive, error: errorArchive } = archivedCard;
  const { loading: loadingUpdate, error: errorUpdate } = updateResponse;

  const getById = useCallback(
    (id: string) => {
      getCard(id);
    },
    [getCard]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `[${error.status}] This card could not be fetched.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  const removeById = useCallback(
    (id: string, branchDeletion: boolean) => {
      removeCard(id, branchDeletion);
    },
    [removeCard]
  );

  useEffect(() => {
    if (errorRemove) {
      dispatch(
        toogleNotification({
          text: `[${errorRemove.status}] This card could not be removed.`,
          status: 'error'
        })
      );
    }
  }, [errorRemove, dispatch]);

  const archiveBy = useCallback(
    (id: string) => {
      archiveCard(id);
    },
    [archiveCard]
  );

  useEffect(() => {
    if (errorArchive) {
      dispatch(
        toogleNotification({
          text: `[${errorArchive.status}] This card could not be archived.`,
          status: 'error'
        })
      );
    }
  }, [errorArchive, dispatch]);

  const update = useCallback(
    (id: string, payload: Payload) => {
      updateCard(id, payload);
    },
    [updateCard]
  );

  useEffect(() => {
    if (errorUpdate) {
      dispatch(
        toogleNotification({
          text: `[${errorUpdate.status}] This card could not be updated.`,
          status: 'error'
        })
      );
    }
  }, [errorUpdate, dispatch]);

  return {
    getById,
    removeById,
    responseRemove,
    loadingRemove,
    archiveBy,
    responseArchive,
    response,
    loading,
    update,
    loadingUpdate
  };
};

interface GenerateRelease extends FetchProps {
  generate: Function;
}

export const useGenerateRelease = (): GenerateRelease => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [releaseData, generateRelease] = useFetch<NewRelease>(generateBuild);
  const { response, error } = releaseData;

  const generate = useCallback(
    (newRelease: NewRelease) => {
      setLoading(true);
      generateRelease(newRelease);
    },
    [generateRelease]
  );

  useEffect(() => {
    if (response) {
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setLoading(false);
      dispatch(
        toogleNotification({
          text: `[${error.status}] The build was not triggered.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  return {
    response,
    loading,
    generate
  };
};

interface CreateCard extends FetchProps {
  create: Function;
  response: Card;
}

export const useCreateCard = (): CreateCard => {
  const [newCard, createCard] = useFetch<Card>(createCardRequest);
  const { response, loading } = newCard;

  const create = useCallback(
    (payload: Payload) => {
      createCard(payload);
    },
    [createCard]
  );

  return {
    response,
    loading,
    create
  };
};
