let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("tasks");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const toast = document.getElementById("toast");

let editIndex = null;

document.addEventListener("DOMContentLoaded", () => {

    renderTasks();

});

taskForm.addEventListener("submit", addTask);

function addTask(e){

    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();

    const description = document.getElementById("taskDescription").value.trim();

    const priority = document.getElementById("taskPriority").value;

    const date = document.getElementById("taskDate").value;

    if(title==="") return;

    const task={

        title,

        description,

        priority,

        date,

        completed:false

    };

    if(editIndex===null){

        tasks.push(task);

        showToast("Task Added");

    }

    else{

        task.completed=tasks[editIndex].completed;

        tasks[editIndex]=task;

        editIndex=null;

        taskForm.querySelector("button").innerHTML=
        '<i class="fa-solid fa-plus"></i> Add Task';

        showToast("Task Updated");

    }

    saveTasks();

    renderTasks();

    taskForm.reset();

}

function renderTasks(){

    taskList.innerHTML="";

    if(tasks.length===0){

        taskList.innerHTML=`

        <div class="empty-state">

        <i class="fa-solid fa-clipboard-list"></i>

        <h3>No Tasks Yet</h3>

        <p>Add your first task to get started.</p>

        </div>

        `;

        updateStats();

        return;

    }

    tasks.forEach((task,index)=>{

        taskList.innerHTML+=`

        <div class="task-card ${task.completed?"completed":""} fade-in">

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <div class="task-meta">

                <span class="priority ${task.priority.toLowerCase()}">

                    ${task.priority}

                </span>

                <span class="task-date">

                    ${task.date||"No Date"}

                </span>

            </div>

            <div class="task-actions">

                <button class="edit-btn"

                onclick="editTask(${index})">

                Edit

                </button>

                <button class="complete-btn"

                onclick="toggleTask(${index})">

                ${task.completed?"Undo":"Complete"}

                </button>

                <button class="delete-btn"

                onclick="deleteTask(${index})">

                Delete

                </button>

            </div>

        </div>

        `;

    });

    updateStats();

}

function saveTasks(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}

function updateStats(){

    const completed=

    tasks.filter(task=>task.completed).length;

    const pending=

    tasks.length-completed;

    totalTasks.textContent=tasks.length;

    completedTasks.textContent=completed;

    pendingTasks.textContent=pending;

    const percent=

    tasks.length===0

    ?0

    :Math.round((completed/tasks.length)*100);

    progressFill.style.width=

    percent+"%";

    progressText.textContent=

    percent+"%";

}

function showToast(message){

    toast.textContent=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

function editTask(index){

    const task=tasks[index];

    document.getElementById("taskTitle").value=task.title;

    document.getElementById("taskDescription").value=task.description;

    document.getElementById("taskPriority").value=task.priority;

    document.getElementById("taskDate").value=task.date;

    editIndex=index;

    taskForm.querySelector("button").innerHTML=
    '<i class="fa-solid fa-pen"></i> Update Task';

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

function deleteTask(index){

    if(!confirm("Delete this task?")) return;

    tasks.splice(index,1);

    saveTasks();

    renderTasks();

    showToast("Task Deleted");

}

function toggleTask(index){

    tasks[index].completed=!tasks[index].completed;

    saveTasks();

    renderTasks();

    showToast(

        tasks[index].completed

        ?"Task Completed"

        :"Task Marked Pending"

    );

}

const searchInput=document.getElementById("searchTask");

searchInput.addEventListener("keyup",()=>{

    const value=

    searchInput.value.toLowerCase();

    document.querySelectorAll(".task-card")

    .forEach(card=>{

        const text=

        card.innerText.toLowerCase();

        card.style.display=

        text.includes(value)

        ?"block"

        :"none";

    });

});

const filterButtons=

document.querySelectorAll(".filter-btn");

filterButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        filterButtons.forEach(btn=>

            btn.classList.remove("active"));

        button.classList.add("active");

        filterTasks(

            button.dataset.filter

        );

    });

});

function filterTasks(filter){

    document.querySelectorAll(".task-card")

    .forEach(card=>{

        const priority=

        card.querySelector(".priority")

        ?.innerText.toLowerCase();

        const completed=

        card.classList.contains("completed");

        switch(filter){

            case "completed":

                card.style.display=

                completed?"block":"none";

                break;

            case "pending":

                card.style.display=

                completed?"none":"block";

                break;

            case "high":

                card.style.display=

                priority==="high"

                ?"block"

                :"none";

                break;

            default:

                card.style.display="block";

        }

    });

}

const themeToggle=

document.getElementById("themeToggle");

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeToggle.innerHTML=

    '<i class="fa-solid fa-sun"></i>';

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const dark=

    document.body.classList.contains("dark");

    localStorage.setItem(

        "theme",

        dark?"dark":"light"

    );

    themeToggle.innerHTML=

    dark

    ?'<i class="fa-solid fa-sun"></i>'

    :'<i class="fa-solid fa-moon"></i>';

});

document.querySelector(".floating-btn")

.addEventListener("click",()=>{

    document.querySelector(".task-form")

    .scrollIntoView({

        behavior:"smooth"

    });

});

const sidebar=

document.querySelector(".sidebar");

const logo=

document.querySelector(".logo");

if(window.innerWidth<992){

    logo.addEventListener("click",()=>{

        sidebar.classList.toggle("show");

    });

}

document.addEventListener("click",e=>{

    if(window.innerWidth>992) return;

    if(

        !sidebar.contains(e.target)

        &&

        !logo.contains(e.target)

    ){

        sidebar.classList.remove("show");

    }

});

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        sidebar.classList.remove("show");

    }

});