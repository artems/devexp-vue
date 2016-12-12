import join from 'url-join';
import {
  endpoint,
  SUBMIT_HEADERS,
  handleFetchResponse,
  handleSubmitResponse
} from './utils';

const ENDPOINT = endpoint('teams');

export function submitTeam(form) {
  return fetch(ENDPOINT, {
    body: JSON.stringify(form),
    method: 'POST',
    headers: SUBMIT_HEADERS
  })
  .then(handleSubmitResponse);
}

export function fetchTeam(id) {
  return fetch(join(ENDPOINT, id))
    .then(handleFetchResponse);
}

export function updateTeam(id, form) {
  return fetch(join(ENDPOINT, id), {
    body: JSON.stringify(form),
    method: 'PUT',
    headers: SUBMIT_HEADERS
  })
  .then(handleSubmitResponse);
}

export function deleteTeam(id) {
  return fetch(join(ENDPOINT, id), {
    method: 'DELETE'
  })
  .then(handleFetchResponse);
}

export function fetchTeamList() {
  return fetch(ENDPOINT)
    .then(handleFetchResponse);
}

export function fetchTeamMemberList(id) {
  return fetch(join(ENDPOINT, id, 'members'))
    .then(handleFetchResponse);
}

export function submitMember(id, form) {
  return fetch(join(ENDPOINT, id, 'members'), {
    body: JSON.stringify(form),
    method: 'POST',
    headers: SUBMIT_HEADERS
  })
  .then(handleSubmitResponse);
}

export function deleteMember(id, login) {
  return fetch(join(ENDPOINT, id, 'members'), {
    body: JSON.stringify({ login }),
    method: 'DELETE',
    headers: SUBMIT_HEADERS
  })
  .then(handleSubmitResponse);
}

export function fetchDriverList() {
  return fetch(join(endpoint('team-manager'), 'drivers'))
    .then(handleFetchResponse);
}

export function syncTeam(team) {
  return fetch(join(endpoint('team-manager'), 'sync-team'), {
    body: JSON.stringify({ team }),
    method: 'POST',
    headers: SUBMIT_HEADERS
  })
  .then(handleFetchResponse);
}
