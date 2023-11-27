export function player(type) {
	if (type === 'human') {
		return '00';
	}

	if (type === 'computer') {
		return Math.floor(Math.random() * 100)
			.toString()
			.padStart(2, '0');
	}
}
//ДОБАВИТЬ - НЕЛЬЗЯ стрелять 2 раза по одной кнопке!
