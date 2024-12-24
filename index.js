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

function handleClick(event) {
	clickCount++
	rapidClickCount++

	createCoin(event.clientX, event.clientY)

	clearTimeout(clickTimer)
	clearTimeout(rapidClickTimer)

	if (rapidClickCount >= 8) {
		hamster.classList.remove('slightly-expanded', 'medium-expanded', 'expanded')
		hamster.classList.add('super-expanded')
		hamster.style.setProperty('--scale', '1.2')
	} else if (rapidClickCount >= 5) {
		hamster.classList.remove(
			'slightly-expanded',
			'medium-expanded',
			'super-expanded'
		)
		hamster.classList.add('expanded')
		hamster.style.setProperty('--scale', '1')
	} else if (clickCount >= 3) {
		hamster.classList.remove('slightly-expanded', 'expanded', 'super-expanded')
		hamster.classList.add('medium-expanded')
		hamster.style.setProperty('--scale', '0.92')
	} else {
		hamster.classList.remove('medium-expanded', 'expanded', 'super-expanded')
		hamster.classList.add('slightly-expanded')
		hamster.style.setProperty('--scale', '0.85')
	}

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

hamster.addEventListener('click', handleClick)