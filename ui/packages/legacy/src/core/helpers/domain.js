const { hostname } = window.location

export const domain = hostname === 'localhost' ? 'localhost' : hostname.slice(hostname.indexOf('.'))
