document.addEventListener('DOMContentLoaded', function() {
    // Пример данных: количество событий по дням
    const eventData = {
      '2025-05-01': 3,
      '2025-05-05': 1,
      '2025-05-12': 5,
      '2025-05-15': 2,
      '2025-05-20': 4,
      '2025-05-25': 1,
      // ... добавьте другие дни по необходимости
    };
  
    function formatDateKey(date) {
      // Форматируем дату в YYYY-MM-DD с учетом локального времени
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    function generateCalendar(year, month, events) {
      const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
      
      const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
      
      const firstDay = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Пн-Вс
      
      document.getElementById('calendar-month-year').textContent = 
        `${monthNames[month]} ${year}`;
      
      const calendarGrid = document.getElementById('calendar-grid');
      calendarGrid.innerHTML = '';
      
      // Добавляем заголовки дней недели
      dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day-header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
      });
      
      // Добавляем пустые ячейки для дней предыдущего месяца
      for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
      }
      
      // Добавляем дни месяца
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = formatDateKey(date); // Используем локальное время
        const eventCount = events[dateString] || 0;
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Устанавливаем цвет в зависимости от количества событий
        if (eventCount > 0) {
          const intensity = Math.min(5, eventCount);
          dayElement.style.backgroundColor = `rgba(182, 0, 214, ${0.2 * intensity})`;
          if(eventCount === 1){
          dayElement.title = `${eventCount} мероприятие`;
          }if(eventCount > 1 && eventCount < 5){
            dayElement.title = `${eventCount} мероприятия`;
          }if(eventCount > 4){
            dayElement.title = `${eventCount} мероприятий`;
          }
        }
        
        calendarGrid.appendChild(dayElement);
      }
    }
    
    // Инициализируем календарь на текущий месяц
    const currentDate = new Date();
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth(), eventData);
  });