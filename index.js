const hamster = document.querySelector('.hamster')
const balanceElement = document.querySelector('.balance')
const coinIcon = document.querySelector('.coin-icon')
let balance = 0
let clickTimeout
let clickTimer
let clickCount = 0
let rapidClickCount = 0
let rapidClickTimer

function createCoin(x, y) {
	const coin = document.createElement('div')
	coin.className = 'coin'
	document.body.appendChild(coin)

	coin.style.left = x - 12 + 'px'
	coin.style.top = y - 12 + 'px'

	const balanceContainer = document.querySelector('.balance-container')
	const containerPos = balanceContainer.getBoundingClientRect()

	const targetX = containerPos.left + 20
	const targetY = containerPos.top + containerPos.height / 2

	let moveX = targetX - x
	let moveY = targetY - y

	coin.style.setProperty('--tx', moveX + 'px')
	coin.style.setProperty('--ty', moveY + 'px')

	coin.addEventListener('animationend', () => {
		coin.remove()
		balance++
		balanceElement.textContent = balance
	})
}

function handleTouch(event) {
	event.preventDefault()

	const touches = event.touches
	for (let i = 0; i < touches.length; i++) {
		const touch = touches[i]
		clickCount++
		rapidClickCount++

		createCoin(touch.clientX, touch.clientY)
	}

	clearTimeout(clickTimer)
	clearTimeout(rapidClickTimer)

	let currentScale = '0.8'
	if (hamster.classList.contains('super-expanded')) {
		currentScale = '1.05'
	} else if (hamster.classList.contains('expanded')) {
		currentScale = '1.0'
	} else if (hamster.classList.contains('medium-expanded')) {
		currentScale = '0.95'
	} else if (hamster.classList.contains('slightly-expanded')) {
		currentScale = '0.85'
	}

	let newScale = currentScale
	if (rapidClickCount >= 8) {
		newScale = '1.05'
		hamster.classList.remove('slightly-expanded', 'medium-expanded', 'expanded')
		hamster.classList.add('super-expanded')
	} else if (rapidClickCount >= 5 && currentScale !== '1.05') {
		newScale = '1.0'
		hamster.classList.remove(
			'slightly-expanded',
			'medium-expanded',
			'super-expanded'
		)
		hamster.classList.add('expanded')
	} else if (clickCount >= 3 && currentScale < '0.95') {
		newScale = '0.95'
		hamster.classList.remove('slightly-expanded', 'expanded', 'super-expanded')
		hamster.classList.add('medium-expanded')
	} else if (currentScale < '0.85') {
		newScale = '0.85'
		hamster.classList.remove('medium-expanded', 'expanded', 'super-expanded')
		hamster.classList.add('slightly-expanded')
	}

	hamster.style.setProperty('--scale', newScale)

	hamster.classList.remove('clicked')
	void hamster.offsetWidth
	hamster.classList.add('clicked')

	clearTimeout(clickTimeout)

	clickTimeout = setTimeout(() => {
		clickCount = 0
		rapidClickCount = 0
		hamster.classList.remove(
			'slightly-expanded',
			'medium-expanded',
			'expanded',
			'super-expanded'
		)
		hamster.style.setProperty('--scale', '0.8')
	}, 1200)

	clickTimer = setTimeout(() => {
		clickCount = 0
	}, 500)

	rapidClickTimer = setTimeout(() => {
		rapidClickCount = 0
	}, 250)
}

document.body.addEventListener('touchstart', handleTouch, { passive: false })
document.body.addEventListener('click', event => {
	createCoin(event.clientX, event.clientY)
	handleTouch({
		preventDefault: () => {},
		touches: [{ clientX: event.clientX, clientY: event.clientY }],
	})
})
