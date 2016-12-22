import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import Delta from "../../data/delta";
import Dynamic from '../../data/dynamic'

import Node from '../../components/node'

interface IProps {
	delta: Delta
}

export default class ExamplePage extends Component<IProps, any> {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		const { delta } = this.props
		return <Node onDelete={this._delete} onMerge={this._edit} label='data' path={[]} data={delta.store.get([])} />
	}
	private _edit = (path: Array<string>, value: any) => {
		this.props.delta.mutation({
			$merge: Dynamic.put({}, path, value)
		})
	}
	private _delete = (path: Array<string>) => {
		this.props.delta.mutation({
			$delete: Dynamic.put({}, path, 1)
		})
	}
}
