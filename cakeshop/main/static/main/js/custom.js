document.addEventListener('DOMContentLoaded', () => {
  const modals = {
    cake: document.getElementById('cake-modal'),
    cake2: document.getElementById('cake2-modal'),
    cream: document.getElementById('cream-modal'),
    design: document.getElementById('design-modal')
  };

  let currentLayerKey = null;
  let selectedOption = null;

  // Клик по свечам
  const candles = document.querySelector('.candles');
  if (candles) {
    candles.addEventListener('click', () => openModal('design'));
  }

  // Клик по слоям и текстам
  document.querySelectorAll('.layer.clickable, .text.clickable').forEach(el => {
    el.addEventListener('click', () => {
      const layer = el.dataset.layer;
      if (layer) openModal(layer);
    });
  });

  // Открытие модалки
  function openModal(key) {
    currentLayerKey = key;
    selectedOption = null;
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

    Object.values(modals).forEach(m => m.classList.add('hidden')); // закрываем все

    const modal = modals[key];
    if (modal) {
      modal.classList.remove('hidden');

      setTimeout(() => {
        function closeOnOutsideClick(e) {
          if (!modal.querySelector('.modal-content').contains(e.target)) {
            modal.classList.add('hidden');
            document.removeEventListener('click', closeOnOutsideClick);
          }
        }
        document.addEventListener('click', closeOnOutsideClick);
      }, 0);
    }
  }

  // Закрытие модалок
  function closeModal() {
    Object.values(modals).forEach(modal => modal.classList.add('hidden'));
    currentLayerKey = null;
    selectedOption = null;
    updatePrice();
  }

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Выбор опции
  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedOption = option;
    });
  });

  // Кнопки подтверждения
  const confirmButtons = {
    cake: document.getElementById('confirm-layer-btn-cake1'),
    cake2: document.getElementById('confirm-layer-btn-cake2'),
    cream: document.getElementById('confirm-layer-btn'),
    design: document.getElementById('confirm-design-btn')
  };

  Object.entries(confirmButtons).forEach(([key, btn]) => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (!selectedOption || currentLayerKey !== key) {
          alert('Пожалуйста, выберите опцию');
          return;
        }

        const newText = selectedOption.dataset.text;
        const newClass = selectedOption.dataset.class;

        if (key === 'cake' || key === 'cake2') {
          ['cake', 'cake2'].forEach(layerKey => {
            document.querySelectorAll(`[data-layer="${layerKey}"]`).forEach(el => {
              if (el.classList.contains('layer')) {
                el.className = `layer ${newClass} clickable`;
                const img = el.querySelector('img');
                if (img) {
                  img.src = `${window.STATIC_URL}main/img/boxes/${newClass}.png`;
                  img.alt = newText;
                }
              } else if (el.classList.contains('text')) {
                el.textContent = newText;
              }
            });
          });
        } else if (key === 'cream') {
          document.querySelectorAll('[data-layer="cream"]').forEach(el => {
            if (el.classList.contains('layer')) {
              el.className = `layer ${newClass} clickable`;
              const img = el.querySelector('img');
              if (img) {
                img.src = `${window.STATIC_URL}main/img/boxes/${newClass}.png`;
                img.alt = newText;
              }
            } else if (el.classList.contains('text')) {
              el.textContent = newText;
            }
          });
        } else if (key === 'design') {
          document.querySelectorAll('[data-layer="design"]').forEach(el => {
            if (el.classList.contains('text')) {
              el.textContent = newText;
            }
          });
        }

        closeModal();
      });
    }
  });

  function updatePrice() {
    let basePrice = 0;

    const sizeLabel = document.querySelector('input[name="count"]:checked')?.nextSibling.textContent.trim();
    if (sizeLabel === 'Бенто 0,5-1 кг') basePrice += 1500;
    else if (sizeLabel === 'Небольшой 1-2 кг') basePrice += 2500;
    else if (sizeLabel === 'Средний 2-3 кг') basePrice += 3500;
    else if (sizeLabel === 'Большой 4+ кг') basePrice += 4500;

    const shapeLabel = document.querySelector('input[name="shape"]:checked')?.nextSibling.textContent.trim();
    let shapeAddon = 0;
    if (shapeLabel === 'Цифра/буква') shapeAddon += 700;
    else if (shapeLabel === 'Сердце') shapeAddon += 500;
    else if (shapeLabel === 'Другое') shapeAddon += 800;

    const soakingLabel = document.querySelector('input[name="soaking"]:checked')?.nextSibling.textContent.trim();
    let soakingAddon = 0;
    if (soakingLabel !== 'Без пропитки') soakingAddon += 300;

    const designText = document.querySelector('.text.layer0').textContent.trim();
    let designAddon = 0;
    if (designText === 'Лёгкий дизайн') designAddon += 700;
    else if (designText === 'Сложный дизайн') designAddon += 1200;

    const cake1 = document.querySelector('.text.layer1').textContent.trim();
    const cream = document.querySelector('.text.layer2').textContent.trim();
    const cake2 = document.querySelector('.text.layer3').textContent.trim();
    let fillingAddon = 0;
    if (cake1 !== 'Шоколадный корж') fillingAddon += 400;
    if (cream !== 'Ванильный мусс') fillingAddon += 500;
    if (cake2 !== 'Шоколадный корж') fillingAddon += 400;

    const goodsPrice = basePrice + shapeAddon + soakingAddon + designAddon + fillingAddon;
    const totalPrice = goodsPrice; // скидки убраны

    document.querySelector('.goods-price').textContent = `${goodsPrice} ₽`;
    document.querySelector('.discount-price').textContent = `0 ₽`;
    document.querySelector('.total-price').textContent = `${totalPrice} ₽`;
  }

  // Слушатели для изменений
  document.querySelectorAll('input[type="radio"]').forEach(inp => {
    inp.addEventListener('change', updatePrice);
  });


  // Начальный расчет
  updatePrice();
});

