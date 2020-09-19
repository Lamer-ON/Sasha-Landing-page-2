'use strict';



document.addEventListener('DOMContentLoaded', function () {


	//!!	Полифилл для matches:
	(function (ELEMENT) {
		ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
		ELEMENT.closest = ELEMENT.closest || function closest(selector) {
			if (!this) return null;
			if (this.matches(selector)) return this;
			if (!this.parentElement) {
				return null
			} else return this.parentElement.closest(selector)
		};
	}(Element.prototype));

	//!!	Полифилл для closest

	(function () {

		// проверяем поддержку
		if (!Element.prototype.closest) {

			// реализуем
			Element.prototype.closest = function (css) {
				var node = this;

				while (node) {
					if (node.matches(css)) return node;
					else node = node.parentElement;
				}
				return null;
			};
		}

	})();


	//!! 							HEADER
	window.onload = function () {
		let menu = document.getElementById('menu');
		menu.onclick = function myFunction() {
			let x = document.getElementById('myTopnav');
			if (x.className === 'topnav') {
				x.className += ' responsive';
			} else {
				x.className = 'topnav';
			}
		}
	}
	//!! 							SLIDER POPUP
	let multiItemSlider = (function () {
		return function (selector, config) {
			let
				_mainElement = document.querySelector(selector), // основный элемент блока
				_sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
				_sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
				_sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
				_sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
				_sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
				_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
				_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
				_positionLeftItem = 0, // позиция левого активного элемента
				_transform = 0, // значение транфсофрмации .slider_wrapper
				_step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
				_items = []; // массив элементов
			// наполнение массива _items
			// _sliderItems.forEach(function (item, index) {
			for (let i = 0; i < _sliderItems.length; i++) {
				_items.push({
					item: _sliderItems[i],
					position: i,
					transform: 0
				});
			}
			//Array.prototype.slice.call(_sliderItems).forEach(function (item, index) {
			//	_items.push({
			//		item: item,
			//		position: index,
			//		transform: 0
			//	});
			//});

			let position = {
				getMin: 0,
				getMax: _items.length - 1,
			}

			let _transformItem = function (direction) {
				if (direction === 'right') {
					if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
						return;
					}
					if (!_sliderControlLeft.classList.contains('slider__control_show')) {
						_sliderControlLeft.classList.add('slider__control_show');
					}
					if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
						_sliderControlRight.classList.remove('slider__control_show');
					}
					_positionLeftItem++;
					_transform -= _step;
				}
				if (direction === 'left') {
					if (_positionLeftItem <= position.getMin) {
						return;
					}
					if (!_sliderControlRight.classList.contains('slider__control_show')) {
						_sliderControlRight.classList.add('slider__control_show');
					}
					if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
						_sliderControlLeft.classList.remove('slider__control_show');
					}
					_positionLeftItem--;
					_transform += _step;
				}
				_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
			}

			// обработчик события click для кнопок "назад" и "вперед"
			let _controlClick = function (e) {
				if (e.target.classList.contains('slider__control')) {
					e.preventDefault();
					let direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
					_transformItem(direction);
				}
			};

			let _setUpListeners = function () {
				// добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
				// _sliderControls.forEach(function (item) {
				Array.prototype.slice.call(_sliderControls).forEach(function (item) {
					item.addEventListener('click', _controlClick);
				});
			}

			// инициализация
			_setUpListeners();

			return {
				right: function () { // метод right
					_transformItem('right');
				},
				left: function () { // метод left
					_transformItem('left');
				}
			}

		}
	}());


	//!! 							Popup-price
	const popupLinks = document.querySelectorAll('.popup-link');
	const body = document.querySelector('body');
	const lockPadding = document.querySelectorAll(".lock-padding");

	let unlock = true;
	const timeout = 500;

	if (popupLinks.length > 0) {
		for (let index = 0; index < popupLinks.length; index++) {
			const popupLink = popupLinks[index];
			popupLink.addEventListener("click", function (e) {
				const popupName = popupLink.getAttribute('href').replace('#', '');
				const currentPopup = document.getElementById(popupName);
				popupOpen(currentPopup);
				e.preventDefault();
			});
		}
	}
	const popupCloseIcon = document.querySelectorAll('.close-popup');
	if (popupCloseIcon.length > 0) {
		for (let index = 0; index < popupCloseIcon.length; index++) {
			const el = popupCloseIcon[index];
			el.addEventListener('click', function (e) {
				popupClose(el.closest('.popup'));
				e.preventDefault();
			});
		}
	}

	function popupOpen(currentPopup) {
		if (currentPopup && unlock) {
			const popupActive = document.querySelector('.popup.open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			currentPopup.classList.add('open');
			currentPopup.addEventListener("click", function (e) {
				if (!e.target.closest('.popup_content')) {
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}

	//function popupClose(popupActive, doUnlock = true) {
	function popupClose(popupActive, doUnlock) {
		doUnlock = true;
		if (unlock) {
			popupActive.classList.remove('open');
			if (doUnlock) {
				bodyUnlock();
			}
		}
	}

	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = lockPaddingValue;
			}
		}
		body.style.paddingRight = lockPaddingValue;
		body.classList.add('lock');

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}

	function bodyUnlock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				for (let index = 0; index < lockPadding.length; index++) {
					const el = lockPadding[index];
					el.style.paddingRight = '0px';
				}
			}
			body.style.paddingRight = '0px';
			body.classList.remove('lock');
		}, timeout);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}

	document.addEventListener('keydown', function (e) {
		if (e.which === 27 & document.querySelector('.popup').classList.contains("open")) {
			e.preventDefault();
			const popupActive = document.querySelector('.popup.open');
			popupClose(popupActive);
		}
	});

	//!			SLIDER--Foto-gallery

	let scrollbar = document.body.clientWidth - window.innerWidth + 'px';

	let slider;
	document.querySelector('[data-target="modal"]').addEventListener('click', function (e) {
		e.preventDefault();
		document.body.style.overflow = 'hidden';
		document.querySelector('#modal').style.marginLeft = scrollbar;
		document.querySelector('#modal').classList.add('modal-open');
		document.querySelector('#modal').classList.add('open');
		if (slider === undefined) {
			slider = multiItemSlider('.slider', {
				isCycling: true
			});
		} else {
			slider.cycle;
		}

	});
	document.querySelector('[data-target="close"]').addEventListener('click', function (e) {
		e.preventDefault();
		document.body.style.overflow = 'visible';
		document.querySelector('#modal').style.marginLeft = '0px';
		document.querySelector('#modal').classList.remove('modal-open');
		document.querySelector('#modal').classList.remove('open');
		slider.stop;
	});

	window.addEventListener("keydown", function (evt) {
		if (evt.keyCode === 27 & document.querySelector('#modal').classList.contains("modal-open")) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal').style.marginLeft = '0px';
			document.querySelector('#modal').classList.remove('modal-open');
			document.querySelector('#modal').classList.remove('open');
			slider.stop;
		}
	});

	window.addEventListener("click", function (evt) {
		if (document.querySelector('#modal').classList.contains("modal-open") & evt.target.classList.contains('lock-padding')) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal').style.marginLeft = '0px';
			document.querySelector('#modal').classList.remove('modal-open');
			document.querySelector('#modal').classList.remove('open');
			slider.stop;
		}
	});

	////!			SLIDER--1
	let slider1;

	document.querySelector('.photo-itm-1').addEventListener('click', function (e) {
		e.preventDefault();

		document.body.style.overflow = 'hidden';
		document.querySelector('#modal1').style.marginLeft = scrollbar;
		document.querySelector('#modal1').classList.add('modal-open');
		if (slider1 === undefined) {
			slider1 = multiItemSlider('.slider1', {
				isCycling: true
			});
		} else {
			slider1.cycle;
		}

	});
	document.querySelector('[data-target="close1"]').addEventListener('click', function (e) {
		e.preventDefault();
		document.body.style.overflow = 'visible';
		document.querySelector('#modal1').style.marginLeft = '0px';
		document.querySelector('#modal1').classList.remove('modal-open');
		slider1.stop;
	});

	window.addEventListener("keydown", function (evt) {
		if (evt.keyCode === 27 & document.querySelector('#modal1').classList.contains("modal-open")) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal1').style.marginLeft = '0px';
			document.querySelector('#modal1').classList.remove('modal-open');
			slider1.stop;
		}
	});

	window.addEventListener("click", function (evt) {
		if (document.querySelector('#modal1').classList.contains("modal-open") & evt.target.classList.contains('lock-padding')) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal1').style.marginLeft = '0px';
			document.querySelector('#modal1').classList.remove('modal-open');
			document.querySelector('#modal1').classList.remove('open');
			slider1.stop;
		}
	});

	////!			SLIDER--2
	let slider2;

	document.querySelector('.photo-itm-2').addEventListener('click', function (e) {
		e.preventDefault();

		document.body.style.overflow = 'hidden';
		document.querySelector('#modal2').style.marginLeft = scrollbar;
		document.querySelector('#modal2').classList.add('modal-open');
		if (slider2 === undefined) {
			slider2 = multiItemSlider('.slider2', {
				isCycling: true
			});
		} else {
			slider2.cycle;
		}

	});
	document.querySelector('[data-target="close2"]').addEventListener('click', function (e) {
		e.preventDefault();
		document.body.style.overflow = 'visible';
		document.querySelector('#modal2').style.marginLeft = '0px';
		document.querySelector('#modal2').classList.remove('modal-open');
		slider2.stop;
	});

	window.addEventListener("keydown", function (evt) {
		if (evt.keyCode === 27 & document.querySelector('#modal2').classList.contains("modal-open")) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal2').style.marginLeft = '0px';
			document.querySelector('#modal2').classList.remove('modal-open');
			slider2.stop;
		}
	});

	window.addEventListener("click", function (evt) {
		if (document.querySelector('#modal2').classList.contains("modal-open") & evt.target.classList.contains('lock-padding')) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal2').style.marginLeft = '0px';
			document.querySelector('#modal2').classList.remove('modal-open');
			document.querySelector('#modal2').classList.remove('open');
			slider2.stop;
		}
	});


	////!			SLIDER--3
	let slider3;

	document.querySelector('.photo-itm-3').addEventListener('click', function (e) {
		e.preventDefault();

		document.body.style.overflow = 'hidden';
		document.querySelector('#modal3').style.marginLeft = scrollbar;
		document.querySelector('#modal3').classList.add('modal-open');
		if (slider3 === undefined) {
			slider3 = multiItemSlider('.slider3', {
				isCycling: true
			});
		} else {
			slider3.cycle;
		}

	});
	document.querySelector('[data-target="close3"]').addEventListener('click', function (e) {
		e.preventDefault();
		document.body.style.overflow = 'visible';
		document.querySelector('#modal3').style.marginLeft = '0px';
		document.querySelector('#modal3').classList.remove('modal-open');
		slider3.stop;
	});

	window.addEventListener("keydown", function (evt) {
		if (evt.keyCode === 27 & document.querySelector('#modal3').classList.contains("modal-open")) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal3').style.marginLeft = '0px';
			document.querySelector('#modal3').classList.remove('modal-open');
			slider3.stop;
		}
	});

	window.addEventListener("click", function (evt) {
		if (document.querySelector('#modal3').classList.contains("modal-open") & evt.target.classList.contains('lock-padding')) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal3').style.marginLeft = '0px';
			document.querySelector('#modal3').classList.remove('modal-open');
			document.querySelector('#modal3').classList.remove('open');
			slider3.stop;
		}
	});


	////!			SLIDER--4
	let slider4;

	document.querySelector('.photo-itm-4').addEventListener('click', function (e) {
		e.preventDefault();

		document.body.style.overflow = 'hidden';
		document.querySelector('#modal4').style.marginLeft = scrollbar;
		document.querySelector('#modal4').classList.add('modal-open');
		if (slider4 === undefined) {
			slider4 = multiItemSlider('.slider4', {
				isCycling: true
			});
		} else {
			slider4.cycle;
		}

	});
	document.querySelector('[data-target="close4"]').addEventListener('click', function (e) {
		e.preventDefault();
		document.body.style.overflow = 'visible';
		document.querySelector('#modal4').style.marginLeft = '0px';
		document.querySelector('#modal4').classList.remove('modal-open');
		slider4.stop;
	});

	window.addEventListener("keydown", function (evt) {
		if (evt.keyCode === 27 & document.querySelector('#modal4').classList.contains("modal-open")) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal4').style.marginLeft = '0px';
			document.querySelector('#modal4').classList.remove('modal-open');
			slider4.stop;
		}
	});

	window.addEventListener("click", function (evt) {
		if (document.querySelector('#modal4').classList.contains("modal-open") & evt.target.classList.contains('lock-padding')) {
			evt.preventDefault();
			document.body.style.overflow = 'visible';
			document.querySelector('#modal4').style.marginLeft = '0px';
			document.querySelector('#modal4').classList.remove('modal-open');
			document.querySelector('#modal4').classList.remove('open');
			slider4.stop;
		}
	});

});