import routes from '../constants/routes';

function buildSearchUrl(
  label: string,
  value: string,
  baseUrl: string,
  frontendUrl: string,
) {
  const searchParams = new URLSearchParams();
  searchParams.set(label, value);
  const url =
    frontendUrl +
    baseUrl +
    '/' +
    routes.search.path +
    `?${searchParams.toString()}`;

  return url;
}

export default buildSearchUrl;
