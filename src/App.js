import React, { PureComponent } from 'react';
import './App.css';
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';
import NotFound from './component/notFound';
import Dashboard from './component/dashboard/dashboard';
import Create from './component/create/create';
import Login from './component/account/login';
import write from './component/write';

class App extends PureComponent {
  render() {
    const links = [
      { route: 'create', comp: Create },
      { route: 'dashboard', comp: Dashboard },
      { route: 'login', comp: Login },
      { route: 'write', comp: write },
    ];
    const height = 3;
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <AppCont />} />
          {/* Dynamically creating routes */}
          {links.map((path) => (
            <Route
              path={`/${path.route}`}
              render={(props) => (
                <path.comp height={`${height}rem`} />
              )}
            />
          ))}
          <Route exact render={(props) => <NotFound {...props} />} />
        </Switch>
      </Router>
    );
  }
}

export default App;

class AppCont extends PureComponent {
  render() {
    return (
      <div className="App">
        <div className="app_wrapper">
          <img
            src={require(`./assets/Welcome_to_Teams 1.png`).default}
            alt="logo"
            loading="lazy"
            className="exam_logo_lg"
          />
          <p className="header1">
            Examiner welcomes you, we're glad you're here
          </p>
          <p className="header2">
            Examiner is your tool to create and participate in exams!
          </p>

          <Link to={{ pathname: '/dashboard' }} className="Link">
            <button className="welcome_btn">
              <img
                src={require(`./assets/Frame 3.png`).default}
                alt="logo"
                className="exam_logo_sm"
              />
              Get Started
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
