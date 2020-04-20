export const genMenuId = (route: string) => `menu${route.split('/').join('-')}`;

export const getActiveMenuId = () => {
  const { pathname } = window.location;
  return genMenuId(pathname);
};

export const getExpandIcon = (expand: boolean) =>
  expand ? 'menu-expanded' : 'menu';
