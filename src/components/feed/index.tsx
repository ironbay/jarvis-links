import './styles.css'
import * as createElement from 'inferno-create-element'
import * as Component from 'inferno-component'
import Container from '../container'

interface IProps {
	children: any
}

interface IState {

}

export default class Feed extends Component<IProps, IState> {
	constructor() {
		super()
	}
	render() {
		return (
			<Container direction='column' className='feed'>
				{this.props.children}
			</Container>
		)
	}
	static Row = Row
	static Image = Image
	static Title = Title
	static Description = Description
	static Highlight = Highlight
	static Frame = Frame
}


function Row(props: IProps) {
	return (
		<Container className='feed-row'>
			{props.children}
		</Container>
	)
}

function Image(props) {
	return (
		<Container styles={{
			backgroundImage: `url('${props.src || 'https://d13yacurqjgara.cloudfront.net/users/239755/screenshots/2502432/broken-image-dribbble_1x.png'}')`
		}} className='feed-image'>
		</Container>
	)
}

function Title(props: IProps) {
	return (
		<div className='feed-title'>
			{props.children}
		</div>
	)
}

function Description(props: IProps) {
	return (
		<div className='feed-description'>
			{props.children}
		</div>
	)
}

function Highlight(props: IProps) {
	return (
		<div className='feed-highlight'>
			{props.children}
		</div>
	)
}


function Frame(props) {
	const { width, height, src } = props
	const style = {
		height: `${height * 480/width}px`,
	}
	return (
		<div style={style} className='feed-frame'>
			<iframe src={src} />
		</div>
	)
}
