import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import forEach from 'lodash/forEach';
import replace from 'lodash/replace';
import toString from 'lodash/toString';
import routes from 'core/constants/routes';

const replaceRoute = (
  path: string,
  pathParams: string[],
  params: (string | number)[]
) => {
  let newPath = path;

  forEach(params, (param, index) => {
    newPath = replace(newPath, pathParams[index], toString(params[index]));
  });

  return newPath;
};

const getPath = (path = '', params: (string | number)[] = []): string => {
  const pathParams = path.match(/:+\w*/gi);

  if (pathParams === null) {
    return path;
  }

  if (pathParams.length !== params.length) {
    return path;
  }

  return replaceRoute(path, pathParams, params);
};

const useRouter = () => {
  const navigate = useHistory();

  return {
    push: (path: string, ...args: (string | number)[]) =>
      navigate.push(getPath(path, args)),
    goBack: () => navigate.goBack(),
    replace: (path: string, ...args: (string | number)[]) =>
      navigate.replace(getPath(path, args)),
    go: (index: number) => navigate.go(index)
  };
};

const redirectToLegacy = (path: string) => {
  const { location } = window;
  const { href } = location;

  if (path === routes.login) {
    location.href = `${path}?redirectTo=${href}`;
  } else {
    location.href = path;
  }
};

export {
  useRouter,
  useLocation,
  useParams,
  useRouteMatch,
  redirectToLegacy,
  getPath,
  replaceRoute
};
