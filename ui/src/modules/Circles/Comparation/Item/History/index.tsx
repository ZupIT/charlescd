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

import React, { useEffect } from 'react';
import { useCircleDeployHistory } from './hooks';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

type Props = {
  id: string;
  onGoBack: Function;
}

const DeployHistory = ({ onGoBack, id }: Props) => {
  const { getCircleDeployHistory, history, status} = useCircleDeployHistory();

  useEffect(() => {
    if (status.isIdle) {
      getCircleDeployHistory(id);
    }
  }, [getCircleDeployHistory, id, status.isIdle]);

  console.log(id, history);

  return (
    <>
      <Styled.Layer data-testid="circles-deploy-history">
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Styled.Title>
          <Icon name="clock" color="dark" size={'25px'} />
          <Text.h2 color="light">History</Text.h2>
        </Styled.Title>
        {/* <Styled.CircleRowWrapper>
          <InfiniteScroll
            dataLength={circles.length}
            next={loadMore}
            hasMore={hasMoreData}
            loader={<Loader.History />}
            height={500}
          >
            {circles?.map(circle => (
              <CircleRow circle={circle} key={circle.id} />
              ))}
          </InfiniteScroll>
              </Styled.CircleRowWrapper> */}
        <>
          <Styled.DeploymentRow>
            <Styled.TableRow>
              <Styled.TableTextName color="light" title="My tip">
                namenamenamenamenamenamenamenamenamenamena
              </Styled.TableTextName>
              <Styled.TableDeployStatus>
                <Styled.Dot status="undeployed"/>
                <Styled.TabledeployStatusName color="light">
                  Deploy Failed
                </Styled.TabledeployStatusName>
              </Styled.TableDeployStatus>
              <Styled.TableExpand name="expand" color="grey" size={'20px'} onClick={() => console.log('expand')}/>
            </Styled.TableRow>
            <Styled.ReleaseRow>
              <Styled.TableTextRelease color="light" title="My tip">
                releasereleasereleasereleasereleasereleaserelease
              </Styled.TableTextRelease>
            </Styled.ReleaseRow>
          </Styled.DeploymentRow>
        </>
      </Styled.Layer>
    </>
  );
};

export default DeployHistory;
