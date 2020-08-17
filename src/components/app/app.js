import React from 'react';
import SectionForm from '../section-form';
import LoginForm from '../login-form';
import { connect } from 'react-redux';

function App({isLoggedIn}) {

  return (
  	<div className="ui container">
  		<div className="ui center aligned basic segment">
  			<h1 className="header">Welcome to my Private App</h1>
		  </div>

      { isLoggedIn && (
        <div className="ui segment">
          <h3 className="header">New Section</h3>
          <SectionForm />
        </div>
      ) }
  		
      { !isLoggedIn && (
        <div className="ui segment">
          <h3 className="header">Login</h3>
          <LoginForm />
        </div>
      )}

		  <div className="ui center aligned basic segment">
		    Powered by <a href="https://appliedlabs.io/" target="_blank" rel="noopener noreferrer">Appliedlabs.io</a>
	    </div>
  	</div>
  );
}

export default connect(
  ({isLoggedIn}) => ({
    isLoggedIn,
  })
)(App);