import React, { PureComponent } from 'react';
import './material-design-icons-iconfont-master/material-design-icons-iconfont-master/dist/material-design-icons.css';
import './App.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import NotFound from './component/notFound';
import Dashboard from './component/dashboard/dashboard';
import Create from './component/create/create';
import Login from './component/account/login';
import Write from './component/write/write';
import Histo from './component/histo/histo';
import TagCreate from './component/create/tagCreate';
import TagList from './component/tag/tagList';
import { loadQuestion, loadTag } from './redux/loader/loader';
import { connect } from 'react-redux';
import WriteOpen from './component/write/writeOpen';
import DragBox from './microComp/dragBox';

class App extends PureComponent {
  state = {
    hideDict: true,
  };
  componentDidMount = () => {
    this.props.loadQuestion();
    this.props.loadTag();
    if (this.props.location.pathname === `/`) {
      this.props.history.push(`/tagList`);
    }
  };

  hideDictToggle = () => {
    this.setState({
      hideDict: !this.state.hideDict,
    });
  };

  render() {
    const links = [
      { route: 'create', comp: Create },
      { route: 'dashboard', comp: Dashboard },
      { route: 'login', comp: Login },
      { route: 'write', comp: Write },
      { route: 'tagCreate', comp: TagCreate },
      { route: 'histo', comp: Histo },
      { route: 'tagList', comp: TagList },
      { route: 'writeOpen', comp: WriteOpen },
    ];
    const height = 3;
    const blackListDictionay = ['/writeOpen', '/write'];
    return (
      <>
        <DictSwitch
          hideDictToggle={this.hideDictToggle}
          hideDict={this.state.hideDict}
        />
        <DragBox
          hide={
            this.state.hideDict ||
            (blackListDictionay.includes(
              this.props.location.pathname,
            ) &&
              window.innerWidth >= 1000)
          }
        />
        <Switch>
          <Route exact path="/" render={(props) => <AppCont />} />
          {/* Dynamically creating routes */}
          {links.map((path, n) => (
            <Route
              path={`/${path.route}`}
              render={(props) => (
                <path.comp height={`${height}rem`} />
              )}
              key={`App_link_${n}_path`}
            />
          ))}
          <Route exact render={(props) => <NotFound {...props} />} />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  loadQuestion: () => dispatch(loadQuestion()),
  loadTag: () => dispatch(loadTag()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(App));

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

const DictSwitch = ({ hideDictToggle, hideDict }) => {
  return (
    <div className="dict_switch_wrapper box center">
      <div
        onClick={hideDictToggle}
        className={`dict_switch_block ${hideDict ? `` : `active`}`}
      >
        <div
          onClick={hideDictToggle}
          className={`dict_switch_roll box ${
            hideDict ? `` : `active`
          }`}
        ></div>
      </div>
    </div>
  );
};
