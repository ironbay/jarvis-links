import Delta from './delta'

export function bind(delta: Delta) {
	const { store } = delta


	// After connecting perform upgrade
	delta.store.intercept(['connection'], async data => {
		if (data.status !== 'ready')
			return

		delta.query({
			'context:links': {
				'slack:strange-loop': {
					limit: 25
				}
			}
		})
		const token = localStorage.getItem('token')
		if (!token) return
		await delta.upgrade(token)
		await delta.subscribe()

	})

	// After upgrading, do some boostrapping
	delta.store.intercept(['user'], data => {
		const key = data['key']
	})

	delta.store.intercept(['context:links', '+'], data => {
		delta.query({
			'link:info':
				Object
				.keys(data)
				.map(key => data[key])
				.reduce((collect, item) => {
					collect[item.url] = {}
					return collect
				}, {})
		})
	})
}
