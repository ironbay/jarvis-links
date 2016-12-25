import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import * as Moment from 'moment'
import Container from '../../components/container'
import Feed from '../../components/feed'

interface IProps {
	items: Array<IItem>
}

interface IState {

}

interface IItem {
	key: string,
	graph: IGraph
	twitter: ITwitter
	url: string
	created: number
}

interface IGraph {
	title?: string
	image?: string
	site_name?: string
	description?: string
}

interface ITwitter {
	title?: string
	image?: string
	description?: string
}

export default class Template extends Component<IProps, IState> {
	constructor() {
		super()
	}
	render() {
		const { items } = this.props
		return (
			<Feed>
			{
				items
				.map((item: IItem) => {
					const graph: IGraph = item.graph || {}
					const twitter: ITwitter = item.twitter || {}
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
		)
	}
}
