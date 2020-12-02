const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// On load
updateDOM()

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns()
  }
  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index)=>{
    createItemEl(backlogList, 0, backlogItem, index)
  })
  backlogListArray = filterArray(backlogListArray)
  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, index)=>{
    createItemEl(progressList, 1, progressItem, index)
  })
  progressListArray = filterArray(progressListArray)
  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index)=>{
    createItemEl(completeList, 2, completeItem, index)
  })
  completeListArray = filterArray(completeListArray)
  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index)=>{
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  onHoldListArray = filterArray(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns()
}
//Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column]
  const selectedColumnEl = listColumns[column].children
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id]
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM()
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent
  const selectedArray = listArrays[column]
  selectedArray.push(itemText)
  addItems[column].textContent = ''
  updateDOM() 
}

// Show Add Item Input Box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}
// Hide Input Box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays(){
  backlogListArray = []
  for (let i = 0; i < backlogList.children.length ; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = []
  for (let i = 0; i < progressList.children.length ; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray= []
  for (let i = 0; i < completeList.children.length ; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = Array.from(onHoldList.children).map(i=>i.textContent)
  updateDOM()
}

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Desarrollar un curso', 'Aprender nuevos temas'];
    progressListArray = ['Trabajar en el proyecto', 'Escuchar música'];
    completeListArray = ['Leer un libro', 'Hacer el almuerzo'];
    onHoldListArray = ['Llamar al proveedor'];
/*     backlogListArray = ['Buscar miel', 'llamar a peloso'];
    progressListArray = ['Publicar en la casita', 'Escuchar música'];
    completeListArray = ['Leer el libro', 'Hacer el almuerzo'];
    onHoldListArray = ['Salir a entrenar']; */
  }
}
    

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  console.log('item:', item)
  console.log('column:', column)
  console.log('index', index)

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = true
  listEl.id = index
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  //Append
  columnEl.appendChild(listEl)
}

//When Items Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true
}

// Columnas permitidas para Droppear un Item
function allowDrop(e){
  e.preventDefault()
}

// Cuando el Item entre al area de la columna
function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column
}

//Dropping Item in Column
function drop(e) {
  e.preventDefault()
  //Remove background color/padding
  listColumns.forEach((column)=>{
    column.classList.remove('over')
  })
  // Add Item to Column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  //Dragging complete
  dragging = false
  rebuildArrays()
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const arrayNames = ['backlogItems', 'progressItems', 'completeItems', 'onHoldItems']
  arrayNames.forEach((arrayName, index)=>{
    localStorage.setItem(arrayName, JSON.stringify(listArrays[index]));
  });
}

//Filter Arrays to remove Empty items
function filterArray(array){
  
  const filteredArray = array.filter( item=> item !== null ) 
  return filteredArray
}

// Drag Functionality