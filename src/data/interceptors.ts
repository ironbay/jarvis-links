import Delta from './delta'

export function bind(delta: Delta) {
	const { store } = delta


	// After connecting perform upgrade
	delta.store.intercept(['connection'], async data => {
		if (data.status !== 'ready')
			return

		delta.query_path(['link:shares'])
		const token = localStorage.getItem('token')
		if (!token) return
		await delta.upgrade(token)
		await delta.subscribe()

	})

	// After upgrading, do some boostrapping
	delta.store.intercept(['user'], data => {
		const key = data['key']
	})
}
