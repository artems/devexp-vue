import join from 'url-join';

export class FetchError extends Error {}

const API_HOST = process.env.MAIN_API.prefix;

export const SUBMIT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export function endpoint(path) {
  return join(API_HOST, path);
}

export function reason(response) {
  if (response && response.status === 404) {
    return 'not found';
  }

  if (response && response.status === 422) {
    return 'validation error';
  }

  return 'unknown';
}

export function handleFetchResponse(response) {
  return Promise.resolve(response)
    .then(response => {
      if (!response.ok) {
        throw new FetchError(response);
      }
      return response;
    })
    .then(response => response.json());
}

export function handleSubmitResponse(response) {
  return Promise.resolve(response)
    .then(response => Promise.all([response, response.json()]))
    .then(([response, json]) => {
      const error = new FetchError();
      error.reason = reason(response);
      error.response = response;

      if (response.status === 422) {
        error.errors = json.errors;
        throw error;
      }

      if (!response.ok) {
        throw error;
      }

      return json;
    });
}
