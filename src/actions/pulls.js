import join from 'url-join';
import {
  endpoint,
  handleFetchResponse
} from './utils';

const ENDPOINT = endpoint('pulls');

export function fetchPullRequest(id) {
  return fetch(join(ENDPOINT, id))
    .then(handleFetchResponse);
}

export function fetchPullRequestList() {
  return fetch(ENDPOINT)
    .then(handleFetchResponse);
}
