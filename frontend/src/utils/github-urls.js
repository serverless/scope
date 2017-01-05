
export function githubIssueURL(number, repo) {
  return `https://github.com/${repo}/issues/${number}`
}

export function githubUserImage(userID, size) {
  const s = size || 460
  return `https://avatars3.githubusercontent.com/u/${userID}?v=3&s=${s}`
}