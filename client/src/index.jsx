import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    }
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/repos',
      success: (data) => {
        console.log('GET SUCCESS', data);
        this.setState({repos: data});
      }
    })
  }

  search (term) {
    console.log(`${term} was searched`);
    // TODO
    $.ajax({
      method: 'POST',
      url: '/repos',
      data: {username: term},
      success: (data) => {
        console.log(data);
        $('#repolist').load('/');
      }
    });
  }

  render () {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos}/>
      <Search onSearch={this.search.bind(this)}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));