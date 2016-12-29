import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import Delta from "../../data/delta";

import Container from '../../components/container'

interface IProps {
	delta: Delta
}

interface IState {

}

export default class EloPage extends Component<IProps, IState> {
	constructor() {
		super()
		this.state = {
			ready: false,
			me: false,
		}
	}
	async componentDidMount() {
		await this.props.delta.mutation({
			$merge: {
				'tv:options': {
					'breaking-bad': 1,
					'sopranos': 1,
					'westworld': 1,
					'westwing': 1,
					'game-of-thrones': 1,
					'atlanta': 1,
					'stranger-things': 1,
					'mad-men': 1,
					'man-in-high-castle': 1,
					'the-wire': 1,
					'veep': 1,
					'curb-your-enthusiasm': 1,
					'big-bang-theory': 1,
					'doctor-who': 1,
					'the-americans': 1,
					'the-office': 1,
					'parks-and-recreation': 1,
					'arrested-development': 1,
					'house-of-cards': 1,
					'party-down': 1,
					'green-wing': 1,
					'sherlock': 1,
					'house': 1,
					'veronica-mars': 1,
					'black-mirror': 1,
					'law-and-order': 1,
					'star-trek': 1,
					'true-detective': 1,
					'broad-city': 1,
					'homeland': 1,
					'entourage': 1,
					'agents-of-shield': 1,
					'daredevil': 1,
					'jessica-jones': 1,
					'luke-cage': 1,
					'planet-earth': 1,
					'band-of-brothers': 1,
					'futurama': 1,
					'rick-and-morty': 1,
					'family-guy': 1,
					'simpsons': 1,
					'legend-of-korra': 1,
					'last-airbender': 1,
					'bojack-horseman': 1,
					'wilfred': 1,
					'californication': 1,
					'the-oa': 1,
				}
			}
		})
		await this.props.delta.query({
			'tv:elo': {}
		})
		this.setState({
			ready: true
		})
	}
	render() {
		if (!this.state.ready)
			return false
		const { delta } = this.props
		const users = delta.store.get(['context:info', 'slack:strange-loop', 'user'])
		if (!users)
			return false
		const me = delta.store.get(['context:info', 'slack:strange-loop', 'user', this.state.me])
		return (
			<Container direction='column' className='elo-page'>
				{!me &&
					<UserSelector
						onSelect={evt => {
							this.setState({me: evt.target.value})
							this._next()
						}}
						users={Object.keys(users).map(k => users[k])} />
				}
				{me && this.state.options && <Choices onChoice={this._choose} options={this.state.options} />}
				{me && <Header onClick={this._next}>Skip</Header> }
			</Container>
		)
	}
	private _choose = (winner: string) => {
		const { delta } = this.props
		const { me, options } = this.state
		const loser = options.filter(i => i !== winner)[0]
		this._user(delta, me, options, winner)
		this._user(delta, 'global', options, winner)
		this._next()
	}
	private _user(delta: Delta, user, options, winner) {
		const ra = delta.store.get(['tv:elo', user, options[0]]) || 1500
		const rb = delta.store.get(['tv:elo', user, options[1]]) || 1500
		const [na, nb] = this._compute(ra, rb, winner == options[0] ? 1 : 0, winner === options[1] ? 1 : 0)
		delta.mutation({
			$merge: {
				'tv:elo': {
					[user]: {
						[options[0]]: na,
						[options[1]]: nb,
					}
				}
			}
		})
	}
	private _compute(ra, rb, sa, sb): Array<number> {
		// Expected
		const qa = 10 ^ (ra / 400)
		const qb = 10 ^ (rb / 400)
		const ea = qa / (qa + qb)
		const eb = qb / (qa + qb)

		// New Score
		const na = ra + 35 * (sa - ea)
		const nb = rb + 35 * (sb - eb)
		console.log(na, nb)
		return [na, nb]
	}
	private _next = () => {
		this.setState({
			options: this._pair()
		})
	}
	private _pair = () => {
		const a = Object.keys(this.props.delta.store.get(['tv:options']))
		var j, x, i;
		for (i = a.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
		return a.slice(0, 2).map(item => item.toLowerCase().split(' ').join('-'))
	}
}

function Choices({ options, onChoice }) {
	return (
		<Container direction='column' className='elo-choices'>
			{
				options.map(option => {
					return <Container onClick={() => onChoice(option)} className='elo-choices-box'>{option.split('-').join(' ')}</Container>
				})
			}
		</Container>
	)
}

function Header({children, ...rest}) {
	return (
		<Container {...rest} className='elo-header'>
			{children}
		</Container>
	)
}

function UserSelector({ onSelect, users }) {
	return (
		<Container direction='column' className='elo-user-selector'>
			<select onChange={onSelect} className='elo-select'>
				<option disabled selected hidden value=''>Who are you</option>
				{
					users
					.sort((a,b) => a.name > b.name ? 1 : -1)
					.map(user => {
						return <option value={user.key}>{user.name}</option>
					})
				}
			</select>
		</Container>
	)
}
