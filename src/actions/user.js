import join from 'url-join';
import {
  endpoint,
  SUBMIT_HEADERS,
  handleFetchResponse,
  handleSubmitResponse
} from './utils';

const ENDPOINT = endpoint('users');

export function submitUser(form) {
  return fetch(ENDPOINT, {
    body: JSON.stringify(form),
    method: 'POST',
    headers: SUBMIT_HEADERS
  })
  .then(handleSubmitResponse);
}

export function fetchUser(id) {
  return fetch(join(ENDPOINT, id))
    .then(handleFetchResponse);
}

export function updateUser(id, form) {
  return fetch(join(ENDPOINT, id), {
    body: JSON.stringify(form),
    method: 'PUT',
    headers: SUBMIT_HEADERS
  })
  .then(handleSubmitResponse);
}

export function deleteUser(id) {
  return fetch(join(ENDPOINT, id), {
    method: 'DELETE'
  })
  .then(handleFetchResponse);
}

export function fetchUserList() {
  return fetch(ENDPOINT)
    .then(handleFetchResponse);
}
