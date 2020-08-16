import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import ApiService from '../../api-service';
import { getAuthInfo, setAuthInfo } from '../../auth-helper';

const FORM_READY = 0;
const FORM_LOADING = 1;

const DEFAULT_DOMAIN = 'evgeniy-dev';
const DEFAULT_PASSWORD = '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';

const apiService = new ApiService();

function LoginForm({set_login_state}) {

	const defaultAuthData = getAuthInfo();

	console.log()

	const [formState, setFormState] = useState(FORM_READY);
	const [domain, setDomain] = useState(defaultAuthData.domain);
	const [password, setPassword] = useState(defaultAuthData.password);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormState(FORM_LOADING);

		apiService.getShopForAuthentication(domain, password)
			.then(res => {
				setFormState(FORM_READY);
				if( "shop" in res ) {
					setErrorMessage( "" );
					setAuthInfo(domain, password);
					set_login_state(true);
				} else {

					setErrorMessage( "Could not connect with domain and password provided" );
				}
			})
			.catch(err => {
				setErrorMessage( err.message );
				setFormState(FORM_READY);
			});
	}

	const handleDomainChange = (e) => {
		let value = e.target.value;
  		value = value.replace(/[^a-z1-9_-]/g, '');
		setDomain(value);
	}

	const insertDefaultData = (e) => {
		setDomain(DEFAULT_DOMAIN);
		setPassword(DEFAULT_PASSWORD);
		e.preventDefault();
	}

	const formClasses = [];
	if ( formState == FORM_LOADING ) {
		formClasses.push('loading');
	}
	if ( errorMessage !== "" ) {
		formClasses.push("error");
	}

	return (
	  	<div>
		    <form className={`ui form ${formClasses.join(" ")}`} onSubmit={handleSubmit} >
		    	<div className="ui error message">
					<div className="header">Authentication failed</div>
					<p>{ errorMessage }</p>
				</div>
				<div className="field">
					<label>Domain</label>
					<div className="ui right labeled input">
					  <div className="ui label">
					    http://
					  </div>
					  <input type="text" placeholder="" value={domain} onChange={handleDomainChange} />
					  <div className="ui label">
					    .myshopify.com
					  </div>
					</div>
			  	</div>
			  	<div className="field">
			    	<label>Password</label>
			    	<input type="text" placeholder=""  value={password} onChange={(e) => setPassword(e.target.value)} />
			    	<a href="#" onClick={insertDefaultData} >Insert evgeniy-dev's password</a>
			  	</div>
			  	<input type="submit" value="Login" className="ui button" disabled={ domain === "" || password === "" } />
			</form>
	    </div>
	);
}

export default connect(
	() => ({}),
	actions
)(LoginForm);