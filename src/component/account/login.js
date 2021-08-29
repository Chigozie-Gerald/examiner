import React, { PureComponent } from 'react';
import './login.css';
import InputField from '../../microComp/inputField/inputField';
import { Link } from 'react-router-dom';

class Login extends PureComponent {
  state = {
    username: '',
    password: '',
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="examLogin_wrap">
        {/*<img
          className="img1"
          src={require('../../assets/cloud.png').default}
          alt=""
          loading={`lazy`}
        />
        <img
          className="img2"
          src={require('../../assets/ash_cloud.png').default}
          alt=""
          loading={`lazy`}
        />
        <img
          className="img3"
          src={require('../../assets/result.png').default}
          alt=""
          loading={`lazy`}
        />*/}
        <div className="fdCol">
          <h1>Sign in</h1>
          <label htmlFor="login_userID">Username</label>
          <InputField
            data={{
              id: 'login_userID',
              value: this.state.name,
            }}
          />
          <label htmlFor="login_passID">Password</label>
          <InputField
            data={{
              id: 'login_passID',
              value: this.state.password,
            }}
          />
          <Link
            to={{ pathname: '/write' }}
            className="Link inline auto examLogin_link mg"
          >
            <button className="examLogin_btn">Sign in</button>
          </Link>
        </div>
        <div className="fdCol"></div>
      </div>
    );
  }
}

export default Login;
