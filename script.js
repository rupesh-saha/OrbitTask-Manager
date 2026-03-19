let allTask = [];
let completedTask = [];

const getListData = () => {
  const listInput = document.getElementById("list-input");
  const inputVal = listInput.value.trim();

  if (inputVal === "") {
    return;
  }

  pushArray(inputVal);

  renderTasks();

  updateStat();

  saveToLocalStorage();

  listInput.value = "";
  listInput.focus();
}

const pushArray = (value) => {
  allTask.push({
    id: Date.now(),
    text: value,
    completed: false
  });
  
}

const listContainer = document.getElementById("list-container");
const allTaskBtn = document.getElementById("all-btn");
const completedBtn = document.getElementById("completed-btn");
const statusTabSection = document.getElementById("status-tabsection");
statusTabSection.classList.add("hidden");
allTaskBtn.classList.remove("active");
completedBtn.classList.remove("active");


const renderTasks = () => {

  statusTabSection.classList.remove("hidden");
  allTaskBtn.classList.add("active");
  
  listContainer.innerHTML="";

  const statusContainer = document.getElementById("status-container");
  statusContainer.innerHTML = "";
  statusContainer.innerHTML = `
    <p><span id="pending-status" class="font-semibold">0</span> remaining &#183; <span id="done-status" class="font-semibold">0</span> completed. </p>
  `;


  allTask.forEach((list, index) => {

    const listCard = document.createElement("div");

    listCard.innerHTML = `
        <li class="list-row">
            <div class="text-3xl md:text-4xl font-thin opacity-30 tabular-nums">${index + 1}</div>
            <div class="list-col-grow font-bold text-xl text-[#162456]">
              <div class="list-text ${list.completed == true ? "line-through" : ""}">${list.text}</div>
              <div class="text-xs uppercase font-semibold opacity-60 text-rose-700">Task Pending</div>
            </div>

            <button class="done-btn btn btn-square btn-ghost bg-green-300">
              <i class="fa-solid fa-square-check"></i>
            </button>
            <button class="delete-btn btn btn-square btn-ghost bg-red-200">
              <i class="fa-solid fa-trash"></i>
            </button>
        </li>
    `;

    listContainer.append(listCard);
  })

  updateStat();
}

const updateStat = () => {
  const pendingStatus = document.getElementById("pending-status");
  const doneStatus = document.getElementById("done-status");

  pendingStatus.innerText = allTask.length;
  doneStatus.innerText = completedTask.length;

  if (pendingStatus.innerText < 0) {
    pendingStatus.innerText = 0;
  }
}

document
  .addEventListener("click", (event) => {
    const clickedElement = event.target;
    const card = clickedElement.closest(".list-row");
    if (!card) return;

    if (event.target.closest(".done-btn")) {
      console.log(card);

      const getID = card.querySelector(".tabular-nums");
      const textList = card.querySelector(".list-text");
      textList.classList.add("line-through");
      
      allTask[getID.innerText - 1].completed = true;
      completedTask.push(allTask[getID.innerText - 1]);


      console.log(allTask);
      console.log(completedTask);
      updateStat();
      saveToLocalStorage();
    }

    if (event.target.closest(".delete-btn")) {
      console.log("Delete clicked");
      const getID = card.querySelector(".tabular-nums");
      const idx = getID.innerText - 1;

      allTask = allTask.filter((list, index) => {
        return index !== idx;
      });

      
      console.log(allTask);
      console.log(completedTask);
      renderTasks();
      updateStat();
      showMissing();
      saveToLocalStorage();
    }
  });

const showMissing = () => {
    if (allTask.length !== 0) {
      return;
    }

    if (allTask.length === 0) {
      listContainer.innerHTML="";
      listContainer.innerHTML=`
        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">No tasks added yet</li>

        <div>
          <h2 class="font-bold text-3xl text-blue-950 text-center py-28">What's on the<br> agenda?...</h2>
        </div>
      `;
    }
    else if (completedTask.length === 0) {
      listContainer.innerHTML="";
      listContainer.innerHTML=`
        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">No tasks completed yet</li>

        <div>
          <h2 class="font-bold text-3xl text-blue-950 text-center py-28">Finish the<br> agenda?...</h2>
        </div>
      `;
    }
}



const allTaskTab = () => {
  allTaskBtn.classList.add("active");
  completedBtn.classList.remove("active");

  if(allTask.length === 0) {
    showMissing();
    return;
  }

  renderTasks();
  updateStat();
}

const completedTaskTab = () => {
  allTaskBtn.classList.remove("active");
  completedBtn.classList.add("active");

  if(completedTask.length === 0) {
    showMissing();
    return;
  }

  listContainer.innerHTML="";

  const statusContainer = document.getElementById("status-container");
  statusContainer.innerHTML = "";
  statusContainer.innerHTML = `
    <p><span id="pending-status" class="font-semibold">0</span> remaining &#183; <span id="done-status" class="font-semibold">0</span> completed. </p>
  `;


  completedTask.forEach((list, index) => {

    const listCard = document.createElement("div");

    listCard.innerHTML = `
        <li class="list-row">
            <div class="text-3xl md:text-4xl font-thin opacity-30 tabular-nums">${index + 1}</div>
            <div class="list-col-grow font-bold text-xl text-[#162456]">
              <div class="list-text">${list.text}</div>
              <div class="text-xs uppercase font-semibold opacity-60 text-green-600">Task Completed</div>
            </div>
        </li>
    `;

    listContainer.append(listCard);
  })
  updateStat();
}

const saveToLocalStorage = () => {
  localStorage.setItem("allTask", JSON.stringify(allTask));
  localStorage.setItem("completedTask", JSON.stringify(completedTask));
}

const loadFromLocalStorage = () => {
  const storedAll = localStorage.getItem("allTask");
  const storedCompleted = localStorage.getItem("completedTask");

  if (storedAll) {
    allTask = JSON.parse(storedAll);
  }
  if (storedCompleted) {
    completedTask = JSON.parse(storedCompleted);
  }

  allTaskTab(); 
};

loadFromLocalStorage();

const clearAllTasks = () => {

  if (confirm("Are you sure you want to delete all tasks? This cannot be undone.")) {
    
    localStorage.removeItem("allTask");
    localStorage.removeItem("completedTask");

    allTask = [];
    completedTask = [];

    renderTasks();    
    updateStat();     
    showMissing();    
    
    statusTabSection.classList.add("hidden");
  }
};


