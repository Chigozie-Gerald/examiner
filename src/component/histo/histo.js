import React, { PureComponent } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import '../map/map.css';
import NotFound from '../notFound';
import HistoAnswer from './HistoAnswer';
import HistoCreate from './histoCreate';
import HistoEdit from './histoEdit';

class Histo extends PureComponent {
  render() {
    console.log(1234123, this.props.match?.url);
    return (
      <Switch>
        <Route
          path={`${this.props.match?.url}`}
          render={(props) => <HistoCreate {...props} />}
        />
        <Route
          path={`${this.props.match?.url}/answer`}
          render={(props) => <HistoAnswer {...props} />}
        />
        <Route
          path={`${this.props.match?.url}/edit`}
          render={(props) => <HistoEdit {...props} />}
        />
        <Route exact render={(props) => <NotFound {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(Histo);
