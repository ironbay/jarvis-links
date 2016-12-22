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
		this.state = {}
	}
	componentDidMount() {
	}
	render() {
		const { delta } = this.props
		const items = delta.store.get(['link:shares']) || {}
		return (
			<Container className='feed-page'>
				<Container.Wrap>
					<Feed>
					{
						Object
						.keys(items)
						.map(key => items[key])
						.sort((a, b) => {
							return a.key < b.key ? -1 : 1
						})
						.map(item => {
							const graph = item.graph || {}
							return (
									<Feed.Row key={item.key}>
										<Feed.Image src={graph.image} />
										<Container direction='column'>
											<a href={item.url} target='_blank'>
												<Feed.Title>
													{graph.title || item.url}
												</Feed.Title>
												{graph.description && <Feed.Description>{graph.description}</Feed.Description>}
												<Feed.Highlight>
													{graph.site_name && `${graph.site_name} | `}
													{Moment(item.created).fromNow()}
												</Feed.Highlight>
											</a>
											{this._frame(item)}
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
}
