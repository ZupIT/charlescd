import without from 'lodash/without';
import { History } from 'history';
import map from 'lodash/map';
import routes from 'core/constants/routes';
import getQueryStrings from 'core/helpers/query';

export const addParamCircle = (history: History, circleId: string) => {
  const query = getQueryStrings();
  query.append('circle', circleId);

  history.push({
    pathname: routes.circlesComparation,
    search: query.toString()
  });
};

export const delParamCircle = (history: History, circleId: string) => {
  const query = getQueryStrings();
  const circles = query.getAll('circle');
  const remaineds = without(circles, circleId);
  const params = new URLSearchParams();

  map(remaineds, id => params.append('circle', id));

  history.push({
    pathname: routes.circlesComparation,
    search: params.toString()
  });
};
