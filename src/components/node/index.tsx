import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'

interface IProps {
	data: Object
	label: string
	path: Array<string>
	onMerge: (path: Array<string>, value: any) => void
	onDelete: (path: Array<string>) => void
}

interface IState {
	hidden: boolean
}

export default class Node extends Component<IProps, IState> {

	constructor(props: IProps) {
		super()
		this.state = {
			hidden: props.path.length > 2
		}
	}
	render() {
		const { data, label, path } = this.props
		const { hidden } = this.state
		const count = Object.keys(data).length
		return (
			<div className='node'>
				<span className='node-label'>
					<span onClick={() => this.toggle(hidden)} className={`node-arrow ${hidden && 'rotate'}`} />
					<span onClick={() => this._delete(path)} className='node-pointer'>"{label}": {'{'}</span>
				</span>
				{
					!hidden && count > 0 && (
						<div className='node-children'>
							{
								Object
								.keys(data)
								.sort((a, b) => a > b ? 1 : -1)
								.map(key => {
									const value = data[key]
									if (value === Object(value))
										return (
											<Node {...this.props} path={[...path, key]} label={key} data={value} />
										)
									const full = [...path, key]
									return (
										<div className='node-field'>
											<span
												onClick={() => this._delete(full)}
												className='node-key'>{JSON.stringify(key)}: </span>
											<span
												onClick={() => this._merge(full, value)}
												className={`node-value ${typeof(value)}`}>
												{JSON.stringify(value)}
											</span>
										</div>
									)
								})
							}
						</div>
					)
				}
				{
					hidden && count > 0 && <span>...</span>
				}
				<span>{'}'}</span>
			</div>
		)
	}
	toggle(val: boolean) {
		this.setState({
			hidden: !val,
		})
	}
	_merge(path: Array<string>, value: any) {
		const { onMerge } = this.props
		if (!onMerge)
			return
		const next = prompt(`Edit ${path.join('.')}`, value)
		if (!next)
			return
		let parsed = next
		try {
			parsed = JSON.parse(next)
		} catch (e) {
		}
		onMerge(path, parsed)
	}
	private _delete = (path: Array<string>) => {
		const result = confirm(`Are you sure you want to delete ${path.join('.')}`)
		if (!result)
			return
		this.props.onDelete(path)
	}
}
