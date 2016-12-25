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
	}
	componentDidUnmount() {
		window.onscroll = undefined
	}
	private _max: string
	render() {
		const { delta } = this.props
		const items: Object = delta.store.get(['link:shares']) || {}
		const sorted =
			Object
			.keys(items)
			.map(key => items[key])
			.sort((a, b) => {
				return a.key < b.key ? -1 : 1
			})
		return (
			<Container className='feed-page'>
				<Container.Wrap>
					<LinkFeed items={sorted} />
				</Container.Wrap>
			</Container>
		)
	}
	private async _next(max) {
		if (this.state.pending)
			return
		this.setState({
			pending: true
		})
		await this.props.delta.query({
			'link:shares': {
				min: max,
				limit: 25,
			}
		})
		this.setState({
			pending: false
		})
	}
}
