import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import Delta from "../../data/delta";
import Dynamic from '../../data/dynamic'

import LinkFeed from '../../structures/link-feed'
import Container from '../../components/container'

interface IProps {
	delta: Delta
}

interface IState {
	pending: boolean
}

export default class FeedPage extends Component<IProps, IState> {
	constructor() {
		super()
		this.state = {
			pending: false
		}
	}
	componentDidMount() {
		window.onscroll = evt => {
			if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
				this._next(this._max)
			}
		}
		this._next('')
	}
	componentDidUnmount() {
		window.onscroll = undefined
	}
	private _max: string
	render() {
		const { delta } = this.props
		const items: Object = delta.store.get(['context:links', 'slack:strange-loop']) || {}
		const sorted =
			Object
			.keys(items)
			.map(key => items[key])
			.sort((a, b) => {
				return a.key < b.key ? -1 : 1
			})
		if (sorted.length === 0)
			return false
		this._max = sorted.slice(-1)[0].key
		return (
			<Container className='feed-page'>
				<Container.Wrap>
					<LinkFeed entries={sorted.map(item => item)} delta={this.props.delta} />
				</Container.Wrap>
			</Container>
		)
	}
	private async _next(min) {
		if (this.state.pending)
			return
		this.setState({
			pending: true
		})
		await this.props.delta.query({
			'context:links': {
				'slack:strange-loop': {
					min: min,
					limit: 25,
				}
			}
		})
		this.setState({
			pending: false
		})
	}
}
