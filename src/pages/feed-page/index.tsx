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
								<a href={item.url} target='_blank'>
									<Feed.Row>
										<Feed.Image src={graph.image} />
										<Container direction='column'>
											<Feed.Title>{graph.title || item.url}</Feed.Title>
											{graph.description && <Feed.Description>{graph.description}</Feed.Description>}
											<Feed.Highlight>{Moment(item.created).fromNow()}</Feed.Highlight>
										</Container>
									</Feed.Row>
								</a>
							)
						})
					}
					</Feed>
				</Container.Wrap>
			</Container>
		)
	}
}
