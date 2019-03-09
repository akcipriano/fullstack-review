import React from 'react';

const RepoList = (props) => (
  <div>
    <h4> Top {props.repos.length} Repos </h4>
    {props.repos.map(repo =>
    <div key={repo.url}>
      <ls>{repo.user} / {repo.name} <br /> Stars: {repo.stars} </ls>
    </div>
      )}
  </div>
)

export default RepoList;