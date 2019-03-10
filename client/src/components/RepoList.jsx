import React from 'react';

const RepoList = (props) => (
  <div id='repolist'>
    <h4> Top {props.repos.length} Repos </h4>
    {props.repos.map(repo =>
    <div key={repo.url}>
      <a href={repo.url} target='_blank'>{repo.user} / {repo.name}</a> <br /> Stars: {repo.stars}
    </div>
      )}
  </div>
)

export default RepoList;