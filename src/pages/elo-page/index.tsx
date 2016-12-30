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
