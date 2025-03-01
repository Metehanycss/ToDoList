document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    let dueDate = taskDate.value;
    const priority = taskPriority.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    
    if (dueDate) {
        let dateObj = new Date(dueDate);
        let day = dateObj.getDate().toString().padStart(2, "0");
        let month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        let year = dateObj.getFullYear();
        dueDate = `${day}-${month}-${year}`;
    } else {
        dueDate = "No date";
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <span>${taskText} - <small>${dueDate}</small></span>
        <span class="priority ${priority}">${priority.toUpperCase()}</span>
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
    `;

    li.querySelector(".edit").addEventListener("click", function () {
        const newText = prompt("Edit task:", taskText);
        if (newText) {
            li.querySelector("span").innerHTML = `${newText} - <small>${dueDate}</small>`;
            saveTasks();
        }
    });

    li.querySelector(".delete").addEventListener("click", function () {
        li.remove();
        saveTasks();
    });

    li.addEventListener("click", function () {
        li.classList.toggle("completed");
        saveTasks();
    });

    taskList.appendChild(li);
    saveTasks();

    taskInput.value = "";
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelector(".active").classList.remove("active");
        btn.classList.add("active");
        filterTasks(btn.dataset.filter);
    });
});

function filterTasks(filter) {
    const tasks = document.querySelectorAll("li");
    tasks.forEach(task => {
        switch (filter) {
            case "all":
                task.style.display = "flex";
                break;
            case "completed":
                task.style.display = task.classList.contains("completed") ? "flex" : "none";
                break;
            case "pending":
                task.style.display = task.classList.contains("completed") ? "none" : "flex";
                break;
        }
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(task => {
        tasks.push({
            text: task.innerText,
            completed: task.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        addTask(task.text, task.completed);
    });
}