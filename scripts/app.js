function createAppLayout() {
    const main = document.createElement('main');
    main.className = 'todo-app';

    const header = document.createElement('header');
    header.className = 'todo-app__header';

    const title = document.createElement('h1');
    title.className = 'todo-app__title';
    title.textContent = 'Список задач';

    const subtitle = document.createElement('p');
    subtitle.className = 'todo-app__subtitle';
    subtitle.textContent = 'Планировщик дел';

    header.append(title, subtitle);

    const addTaskSection = document.createElement('section');
    addTaskSection.className = 'todo-app__add-section';

    const addTaskTitle = document.createElement('h2');
    addTaskTitle.textContent = 'Новая задача';

    const taskForm = document.createElement('form');
    taskForm.className = 'task-form';
    taskForm.id = 'task-form';

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'task-title');
    titleLabel.textContent = 'Название задачи';

    const titleInput = document.createElement('input');
    titleInput.id = 'task-title';
    titleInput.name = 'title';
    titleInput.type = 'text';
    titleInput.placeholder = 'Новая задача';
    titleInput.autocomplete = 'off';
    titleInput.required = true;

    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', 'task-date');
    dateLabel.textContent = 'Дата выполнения';

    const dateInput = document.createElement('input');
    dateInput.id = 'task-date';
    dateInput.name = 'date';
    dateInput.type = 'date';
    dateInput.required = true;

    const addButton = document.createElement('button');
    addButton.className = 'button button--primary';
    addButton.type = 'submit';
    addButton.textContent = 'Добавить задачу';

    taskForm.append(
        titleLabel,
        titleInput,
        dateLabel,
        dateInput,
        addButton,
    );
    addTaskSection.append(addTaskTitle, taskForm);

    const controlsSection = document.createElement('section');
    controlsSection.className = 'todo-app__controls';

    const controlsTitle = document.createElement('h2');
    controlsTitle.textContent = 'Поиск и фильтры';

    const searchLabel = document.createElement('label');
    searchLabel.setAttribute('for', 'task-search');
    searchLabel.textContent = 'Поиск по названию';

    const searchInput = document.createElement('input');
    searchInput.id = 'task-search';
    searchInput.type = 'search';
    searchInput.placeholder = 'Введите название задачи';
    searchInput.autocomplete = 'off';

    const filterLabel = document.createElement('label');
    filterLabel.setAttribute('for', 'task-filter');
    filterLabel.textContent = 'Статус';

    const filterSelect = document.createElement('select');
    filterSelect.id = 'task-filter';

    const allTasksOption = document.createElement('option');
    allTasksOption.value = 'all';
    allTasksOption.textContent = 'Все задачи';

    const activeTasksOption = document.createElement('option');
    activeTasksOption.value = 'active';
    activeTasksOption.textContent = 'Невыполненные';

    const completedTasksOption = document.createElement('option');
    completedTasksOption.value = 'completed';
    completedTasksOption.textContent = 'Выполненные';

    filterSelect.append(
        allTasksOption,
        activeTasksOption,
        completedTasksOption,
    );

    const sortLabel = document.createElement('label');
    sortLabel.setAttribute('for', 'task-sort');
    sortLabel.textContent = 'Сортировка';

    const sortSelect = document.createElement('select');
    sortSelect.id = 'task-sort';

    const manualSortOption = document.createElement('option');
    manualSortOption.value = 'manual';
    manualSortOption.textContent = 'Ручной порядок';

    const dateAscendingOption = document.createElement('option');
    dateAscendingOption.value = 'date-ascending';
    dateAscendingOption.textContent = 'Сначала ближайшие';

    const dateDescendingOption = document.createElement('option');
    dateDescendingOption.value = 'date-descending';
    dateDescendingOption.textContent = 'Сначала поздние';

    sortSelect.append(
        manualSortOption,
        dateAscendingOption,
        dateDescendingOption,
    );

    controlsSection.append(
        controlsTitle,
        searchLabel,
        searchInput,
        filterLabel,
        filterSelect,
        sortLabel,
        sortSelect,
    );

    const tasksSection = document.createElement('section');
    tasksSection.className = 'todo-app__tasks';

    const tasksTitle = document.createElement('h2');
    tasksTitle.textContent = 'Задачи';

    const tasksCount = document.createElement('p');
    tasksCount.className = 'todo-app__count';
    tasksCount.textContent = 'Всего задач: 0';

    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'todo-app__empty-message';
    emptyMessage.textContent = 'Задач пока нет';

    const taskList = document.createElement('ul');
    taskList.className = 'task-list';
    taskList.id = 'task-list';

    tasksSection.append(tasksTitle, tasksCount, emptyMessage, taskList);
    main.append(header, addTaskSection, controlsSection, tasksSection);
    document.body.prepend(main);

    return {
        taskForm,
        titleInput,
        dateInput,
        searchInput,
        filterSelect,
        sortSelect,
        tasksCount,
        emptyMessage,
        taskList,
    };
}

const elements = createAppLayout();

const TASKS_STORAGE_KEY = 'tasks';

function loadTasks() {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (!savedTasks) {
        return [];
    }

    try {
        const parsedTasks = JSON.parse(savedTasks);
        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();

function createTaskElement(task) {
    const taskElement = document.createElement('li');
    taskElement.id = `task-${task.id}`;
    taskElement.className = 'task-item';
    taskElement.dataset.taskId = task.id;

    if (task.completed) {
        taskElement.classList.add('task-item--completed');
    }

    const completedCheckbox = document.createElement('input');
    completedCheckbox.className = 'task-item__checkbox';
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = task.completed;
    completedCheckbox.setAttribute(
        'aria-label',
        `Отметить задачу «${task.title}» как выполненную`,
    );
    completedCheckbox.addEventListener('change', () => {
        changeTaskCompleted(task, completedCheckbox.checked);
    });

    const taskContent = document.createElement('div');
    taskContent.className = 'task-item__content';

    const taskTitle = document.createElement('h3');
    taskTitle.className = 'task-item__title';
    taskTitle.textContent = task.title;

    const taskDate = document.createElement('time');
    taskDate.className = 'task-item__date';
    taskDate.dateTime = task.date;
    taskDate.textContent = `Срок: ${task.date}`;

    taskContent.append(taskTitle, taskDate);

    const actions = document.createElement('div');
    actions.className = 'task-item__actions';

    const editButton = document.createElement('button');
    editButton.className = 'button task-item__edit-button';
    editButton.type = 'button';
    editButton.dataset.action = 'edit';
    editButton.textContent = 'Редактировать';
    editButton.addEventListener('click', () => {
        startTaskEditing(task, taskElement);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'button task-item__delete-button';
    deleteButton.type = 'button';
    deleteButton.dataset.action = 'delete';
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
        deleteTask(task.id);
    });
    actions.append(editButton, deleteButton);
    taskElement.append(completedCheckbox, taskContent, actions);

    return taskElement;
}

function getVisibleTasks() {
    const searchQuery = elements.searchInput.value.trim().toLowerCase();
    const selectedFilter = elements.filterSelect.value;
    let visibleTasks = [...tasks];

    if (searchQuery) {
        visibleTasks = visibleTasks.filter((task) =>
            task.title.toLowerCase().includes(searchQuery),
        );
    }

    if (selectedFilter === 'active') {
        visibleTasks = visibleTasks.filter((task) => !task.completed);
    }

    if (selectedFilter === 'completed') {
        visibleTasks = visibleTasks.filter((task) => task.completed);
    }

    return visibleTasks;
}

function renderTasks() {
    elements.taskList.replaceChildren();
    const visibleTasks = getVisibleTasks();

    visibleTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        elements.taskList.append(taskElement);
    });

    const searchOrFilterIsActive =
        elements.searchInput.value.trim() !== '' ||
        elements.filterSelect.value !== 'all';

    elements.tasksCount.textContent = searchOrFilterIsActive
        ? `Показано: ${visibleTasks.length} из ${tasks.length}`
        : `Всего задач: ${tasks.length}`;

    elements.emptyMessage.textContent = tasks.length === 0
        ? 'Задач пока нет'
        : 'По выбранным условиям ничего не найдено';
    elements.emptyMessage.hidden = visibleTasks.length > 0;
}

function handleTaskFormSubmit(event) {
    event.preventDefault();

    const title = elements.titleInput.value.trim();
    const date = elements.dateInput.value;

    if (!title || !date) {
        return;
    }

    const newTask = {
        id: Date.now(),
        title,
        date,
        completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    elements.taskForm.reset();
    elements.titleInput.focus();
}

elements.taskForm.addEventListener('submit', handleTaskFormSubmit);
elements.searchInput.addEventListener('input', renderTasks);
elements.filterSelect.addEventListener('change', renderTasks);

function changeTaskCompleted(task, completed) {
    task.completed = completed;
    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function startTaskEditing(task, taskElement) {
    const editForm = document.createElement('form');
    editForm.className = 'task-edit-form';

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', `edit-title-${task.id}`);
    titleLabel.textContent = 'Название задачи';

    const titleInput = document.createElement('input');
    titleInput.id = `edit-title-${task.id}`;
    titleInput.type = 'text';
    titleInput.value = task.title;
    titleInput.required = true;

    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', `edit-date-${task.id}`);
    dateLabel.textContent = 'Дата выполнения';

    const dateInput = document.createElement('input');
    dateInput.id = `edit-date-${task.id}`;
    dateInput.type = 'date';
    dateInput.value = task.date;
    dateInput.required = true;

    const formActions = document.createElement('div');
    formActions.className = 'task-edit-form__actions';

    const saveButton = document.createElement('button');
    saveButton.className = 'button button--primary';
    saveButton.type = 'submit';
    saveButton.textContent = 'Сохранить';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'button';
    cancelButton.type = 'button';
    cancelButton.textContent = 'Отмена';
    cancelButton.addEventListener('click', renderTasks);

    formActions.append(saveButton, cancelButton);
    editForm.append(
        titleLabel,
        titleInput,
        dateLabel,
        dateInput,
        formActions,
    );

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newTitle = titleInput.value.trim();
        const newDate = dateInput.value;

        if (!newTitle || !newDate) {
            return;
        }

        task.title = newTitle;
        task.date = newDate;
        saveTasks();
        renderTasks();
    });

    taskElement.classList.add('task-item--editing');
    taskElement.replaceChildren(editForm);
    titleInput.focus();
    titleInput.select();
}

renderTasks();
