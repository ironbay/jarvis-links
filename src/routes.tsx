import * as createElement from 'inferno-create-element'
import { Router, Route, Link } from 'inferno-router';
import * as History from 'history';
const browserHistory = History.createBrowserHistory()

export const history = browserHistory

import Root from './pages/root'
import ExamplePage from './pages/example-page'
import FeedPage from './pages/feed-page'
import EloPage from './pages/elo-page'


export const routes = (
	<Router history={browserHistory}>
		<Route path='/' component={Root}>
			<Route path='/' component={FeedPage} />
			<Route path='/debug' component={ExamplePage} />
			<Route path='/elo' component={EloPage} />
		</Route>
	</Router>
)
