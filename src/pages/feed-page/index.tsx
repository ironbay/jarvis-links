import './styles.css'
import * as Moment from 'moment'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import Delta from "../../data/delta";
import Dynamic from '../../data/dynamic'

import Feed from '../../components/feed'
import Container from '../../components/container'

interface IProps {
	delta: Delta
}

export default class FeedPage extends Component<IProps, any> {
	constructor() {
		super()
		this.state = {
			pending: false
		}
	}
	componentDidMount() {
		window.onscroll = evt => {
			if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
				console.log("Get next", this._max)
				this._next(this._max)
			}
		}
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
		if (sorted.length === 0)
			return false
		this._max = sorted.slice(-1)[0].key
		return (
			<Container className='feed-page'>
				<Container.Wrap>
					<Feed>
					{
						sorted
						.map(item => {
							const graph = item.graph || {}
							const twitter = item.twitter || {}
							return (
									<Feed.Row key={item.key}>
										<Feed.Image src={graph.image || twitter.image} />
										<Container direction='column'>
											<a href={item.url} target='_blank'>
												<Feed.Title>
													{graph.title || twitter.title || item.url}
												</Feed.Title>
												<Feed.Description>{graph.description || twitter.description}</Feed.Description>
												<Feed.Highlight>
													{graph.site_name && `${graph.site_name} | `}
													{Moment(item.created).fromNow()}
												</Feed.Highlight>
											</a>
										</Container>
									</Feed.Row>
							)
						})
					}
					</Feed>
				</Container.Wrap>
			</Container>
		)
	}
	private _frame(item) {
		const graph = item.graph || {}
		const twitter = item.twitter || {}
		switch (true) {
			case twitter['site'] === 'SoundCloud':
				twitter.player = twitter.player.replace('visual=true', '')
				twitter['player:height'] = 166
			case twitter['player'] !== undefined:
				return <Feed.Frame width={twitter['player:width']}  height={twitter['player:height']} src={twitter["player"]} />
		}
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
