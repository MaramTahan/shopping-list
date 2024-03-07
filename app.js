// Shopping List Applikation
//--------------------------
(function(){
//call the elements
const form = document.querySelector('#shopping-form');
const shoppingInput = document.querySelector('#shopping-input');
const clearButton = document.querySelector('#clear-list');
//const filterInput = document.querySelector('#filter-search');
const shoppingList = document.querySelector('#shopping-list');
const saveButton = form.querySelector('button');

let isInEditMode = false;

//-------------------------------------------
//here make function to upload the shopping list
//which already save it in local storage
const onDisplayShopping =() => {
  const itemsList = getFromStorage();
  itemsList.forEach((item) => addShoppingToDom(item));
  updateUI();
};

//-----------------------------------
const onSaveItem = (e) => {
  e.preventDefault();

  // Get the value from shopping-input textbox
  const shopping = shoppingInput.value;

  // Verify that the text box contains a value
  //and if not appear error message.
  if (shopping === '') {
    const errorMsg = createErrorMessage(
      'You must enter an item!'
    );
    document.querySelector('.message-container').appendChild(errorMsg);

    //Remove the error message after 3 second
    setTimeout(() => {
      errorMsg.classList.add('show');
      setTimeout(() => {
        const msg = document.querySelector('#error-message');
        msg.classList.remove('show');
        msg.addEventListener('transitionend', () => msg.remove());
      }, 3000);
    }, 10);

    return;
  }
//here to uppdate the list is storage after edit
  if (isInEditMode) {
    const shoppingToUpdate = shoppingList.querySelector('.edit-mode');
    removeFromStorage(shoppingToUpdate.textContent);
    shoppingToUpdate.classList.remove('.edit-mode');
    shoppingToUpdate.remove();
    isInEditMode = false;
  }
  //here to appear error message to user 
  //if the item is already in the list
  else {
    if (checkIfItemExists(shopping)){
      const errorMsg = createErrorMessage(
        `${shopping} is already in the list`
      );
      document.querySelector('.message-container').appendChild(errorMsg);
  
      //Remove the error message after 3 second
      setTimeout(() => {
        errorMsg.classList.add('show');
        setTimeout(() => {
          const msg = document.querySelector('#error-message');
          msg.classList.remove('show');
          msg.addEventListener('transitionend', () => msg.remove());
        }, 3000);
      }, 10);
      return;
    }
  }
  
  // Add item to list
  addShoppingToDom(shopping);
  addToStorage(shopping);
  updateUI();
};
//-------------------------------------

const addShoppingToDom = (shopping) => {
  const item = document.createElement('li');
  item.appendChild(document.createTextNode(shopping));
  item.appendChild(createIconButton('btn-remove text-red'));

  shoppingList.appendChild(item);

  console.log(item);
};
//----------------Local Storage-----------------
const addToStorage = (shopping) => {
  const itemsList = getFromStorage();

  itemsList.push(shopping);

  localStorage.setItem('itemsList', JSON.stringify(itemsList));

};

const getFromStorage = () => {
  let items;

  if (localStorage.getItem('itemsList') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('itemsList'));
  }

  return items;
};

const removeFromStorage = (shopping) => {
  let itemsList = getFromStorage();

  itemsList = itemsList.filter((item) => item !== shopping);
  console.log(itemsList);
  localStorage.setItem('itemsList', JSON.stringify(itemsList));
};
//------------------------------------------

const onClickShopping = (e) => {
  if (e.target.parentElement.classList.contains('btn-remove')) {
    removeShopping(e.target.parentElement.parentElement);
  }
  else{
    editShopping(e.target);
  }
};

//--------------------check item-----------------
//check if the item already is include in the list
const checkIfItemExists = (shopping) => {
  const itemFromStorage = getFromStorage();
  return itemFromStorage.includes(shopping);
};
//--------------------------------------

//-------------------create edit method-----------
const editShopping = (shopping) => {
  isInEditMode = true;

  shoppingList.querySelectorAll('li').forEach((item) => item.classList.remove('edit-mode'));

  shopping.classList.add('edit-mode');
  saveButton.classList.add('btn-edit');
  saveButton.innerHTML = '<i class="fa-light fa-pen"></i> Update';
  shoppingInput.value = shopping.textContent;
};
//------------------------------------------------

const onClearList = () => {
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  //Clears localstorage of everything for this ip address.
  // localStorage.clear();
  localStorage.removeItem('itemsList');
  updateUI();
};
//--------------------------------------
//add search function
// const onFilterShopping = (e) => {
//   const itemsList = document.querySelectorAll('li');
//   const value = e.target.value.toLowerCase();
//   itemsList.forEach((item) => {
//     const itemName = item.firstChild.textContent.toLowerCase();
//     if (itemName.indexOf(value) !== -1) {
//       item.style.display = 'flex';
//     }
//     else{
//       item.style.display = 'none';
//     }
//   });
// };
//-----------------------------------

const removeShopping = (item) => {
  item.remove();
  removeFromStorage(item.textContent);
};

const createIconButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  button.appendChild(createIcon('fa-regular fa-trash-can'));
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};
//------------------------------------------------
//create error message appear if the input shopping is empty
const createErrorMessage = (text) => {
  const div = document.createElement('div');
  div.id = 'error-message';
  const textContent = document.createTextNode(text);
  div.classList.add('error-message');
  div.appendChild(textContent);
  return div;
};
//-----------------------------------------------
//here will make function to remove search input 
//if the list is empty.
const updateUI = () => {
  shoppingInput.value = '';

  const itemsList = document.querySelectorAll('li');
  if (itemsList.length === 0) {
    clearButton.style.display = 'none';
    //filterInput.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    //filterInput.style.display = 'block';
  }
//here for return to the basic after finish with edit
  saveButton.innerHTML = "<i class='fa-solid fa-plus'></i> Add";
  saveButton.classList.remove('btn-edit');
  saveButton.classList.add('btn-primary');

  isInEditMode = false;
};
//---------------------------------------------

// Attach events to the elements
form.addEventListener('submit', onSaveItem);
clearButton.addEventListener('click', onClearList);
shoppingList.addEventListener('click', onClickShopping);
//filterInput.addEventListener('shoppingInput', onFilterShopping);
document.addEventListener('DOMContentLoaded', onDisplayShopping);
//------------------------------------------------

})();