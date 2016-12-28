import Delta from "../../data/delta";
import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import * as Moment from 'moment'
import Container from '../../components/container'
import Feed from '../../components/feed'

interface IProps {
	entries: Array<IEntry>
	delta: Delta
}

interface IState {

}

interface IEntry {
	url: string
	created: number
	context: IContext
}

interface ILink {
	key: string,
	graph: IGraph
	twitter: ITwitter
	url: string
}

interface IContext {
	channel: string,
	sender: string
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

export default class LinkFeed extends Component<IProps, IState> {
	constructor() {
		super()
	}
	render() {
		const { entries, delta } = this.props
		return (
			<Feed>
			{
				entries
				.map(entry => {
					const link: ILink = delta.store.get(['link:info', entry.url])
					const context: IContext = entry.context || {sender: '', channel: ''}

					const channel =
						delta.store.get([
							'context:info',
							'slack:strange-loop',
							'channel',
							context.channel,
							'name'
						])

					const sender =
						delta.store.get([
							'context:info',
							'slack:strange-loop',
							'user',
							context.sender,
							'name'
						])
					if (!link)
						return false
					const graph: IGraph = link.graph || {}
					const twitter: ITwitter = link.twitter || {}
					return (
							<Feed.Row key={link.key}>
								<Feed.Image src={graph.image || twitter.image} />
								<Container direction='column'>
									<a href={link.url} target='_blank'>
										<Feed.Title>
											{graph.title || twitter.title || link.url}
										</Feed.Title>
										<Feed.Description>{graph.description || twitter.description}</Feed.Description>
										<Feed.Highlight>
											{graph.site_name && `${graph.site_name} | `}
											{Moment(entry.created).fromNow()}
											{channel && ` in #${channel}`}
											{sender && ` by ${sender}`}
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
