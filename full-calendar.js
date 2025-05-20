document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const eventModal = document.getElementById('eventModal');
    const eventForm = document.getElementById('eventForm');
    const addEventBtn = document.getElementById('addEventBtn');
    const closeBtn = document.querySelector('.close');
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    const modalTitle = document.getElementById('modalTitle');
    
    // Инициализация календаря
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ru',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День'
        },
        editable: true,
        selectable: true,
        select: function(info) {
            // Автозаполнение даты при клике на календарь
            document.getElementById('eventStart').value = info.startStr.substring(0, 16);
            if (info.end) {
                document.getElementById('eventEnd').value = info.endStr.substring(0, 16);
            }
            modalTitle.textContent = 'Добавить событие';
            deleteEventBtn.style.display = 'none';
            openModal();
        },
        eventClick: function(info) {
            // Просмотр/редактирование события при клике
            const event = info.event;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventStart').value = event.startStr.substring(0, 16);
            document.getElementById('eventEnd').value = event.end ? event.endStr.substring(0, 16) : '';
            document.getElementById('eventDescription').value = event.extendedProps.description || '';
            document.getElementById('eventColor').value = event.backgroundColor || '#7f3d9e';
            
            // Сохраняем ID события для редактирования
            eventForm.dataset.eventId = event.id;
            
            modalTitle.textContent = 'Редактировать событие';
            deleteEventBtn.style.display = 'inline-block';
            openModal();
        },
        events: JSON.parse(localStorage.getItem('calendarEvents')) || []
    });
    
    calendar.render();
    
    // Открытие модального окна
    function openModal() {
        eventModal.style.display = 'block';
    }
    
    // Закрытие модального окна
    function closeModal() {
        eventModal.style.display = 'none';
        eventForm.reset();
        delete eventForm.dataset.eventId;
        deleteEventBtn.style.display = 'none';
    }
    
    // Обработчики событий
    addEventBtn.addEventListener('click', function() {
        // Сброс формы и открытие модального окна
        eventForm.reset();
        document.getElementById('eventColor').value = '#7f3d9e';
        modalTitle.textContent = 'Добавить событие';
        deleteEventBtn.style.display = 'none';
        openModal();
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    // Обработчик кнопки удаления
    deleteEventBtn.addEventListener('click', function() {
        if (eventForm.dataset.eventId) {
            const eventId = eventForm.dataset.eventId;
            const event = calendar.getEventById(eventId);
            
            if (event) {
                // Удаляем событие из календаря
                event.remove();
                
                // Удаляем событие из localStorage
                let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
                events = events.filter(e => e.id !== eventId);
                localStorage.setItem('calendarEvents', JSON.stringify(events));
                
                closeModal();
            }
        }
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === eventModal) {
            closeModal();
        }
    });
    
    // Обработка отправки формы
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('eventTitle').value;
        const start = document.getElementById('eventStart').value;
        const end = document.getElementById('eventEnd').value;
        const description = document.getElementById('eventDescription').value;
        const color = document.getElementById('eventColor').value;
        
        const eventData = {
            title: title,
            start: start,
            end: end || null,
            description: description,
            backgroundColor: color,
            borderColor: color
        };
        
        // Получаем все события из localStorage
        let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
        
        if (eventForm.dataset.eventId) {
            // Редактирование существующего события
            const eventId = eventForm.dataset.eventId;
            const event = calendar.getEventById(eventId);
            
            if (event) {
                event.setProp('title', title);
                event.setStart(start);
                event.setEnd(end);
                event.setExtendedProp('description', description);
                event.setProp('backgroundColor', color);
                event.setProp('borderColor', color);
                
                // Обновляем событие в массиве
                const index = events.findIndex(e => e.id === eventId);
                if (index !== -1) {
                    events[index] = {
                        id: eventId,
                        title: title,
                        start: start,
                        end: end || null,
                        description: description,
                        backgroundColor: color,
                        borderColor: color
                    };
                }
            }
        } else {
            // Добавление нового события
            const newEvent = {
                id: Date.now().toString(),
                title: title,
                start: start,
                end: end || null,
                description: description,
                backgroundColor: color,
                borderColor: color
            };
            
            calendar.addEvent(newEvent);
            events.push(newEvent);
        }
        
        // Сохраняем события в localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        closeModal();
    });
});