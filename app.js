// STORAGE CONTROLLER
const StorageCtrl = (function () {
  // public var
  return {
    StoreItem: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        (items = []), items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemFromStore: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemFromStorage: function (updateItem) {
      let listItems;

      listItems = JSON.parse(localStorage.getItem("items"));

      listItems.forEach(function (listItem, index) {
        if (updateItem.id === listItem.id) {
          listItems.splice(index, 1, updateItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(listItems));
    },
    RemoveItemFromStore: function (id) {
      let listItems;

      listItems = JSON.parse(localStorage.getItem("items"));

      listItems.forEach(function (listItem, index) {
        if (id === listItem.id) {
          listItems.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(listItems));
    },
    clrAllItemFromStore: function () {
     
        localStorage.removeItem("items");
      
    },
  };
})();

// ITEM CONTROLLER
const ITEMCtrl = (function () {
  const Item = function (id, name, calories) {
    (this.id = id), (this.name = name), (this.calories = calories);
  };

  // Data and Item structure
  const Data = {
    //  items: [
    // //   // { id: 1, name: "Egg", calories: 200 },
    // //   // { id: 2, name: "Pizza", calories: 500 },
    // //   // { id: 3, name: "stake Dinner", calories: 800 },
    // ],
    items: StorageCtrl.getItemFromStore(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public var
  return {
    getItem: function () {
      return Data.items;
    },
    addItem: function (name, calories) {
      let ID;
      if (Data.items.length > 0) {
        ID = Data.items[Data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // passing calories as a number
      calories = parseInt(calories);
      //  creating new item
      const NewItem = new Item(ID, name, calories);
      // push new item into Data.item
      Data.items.push(NewItem);

      return NewItem;
    },
    getTotalCalories: function () {
      let total = 0;
      Data.items.forEach(function (item) {
        total += item.calories;
      });
      Data.totalCalories = total;

      return Data.totalCalories;
    },
    getData: function () {
      return Data;
    },
    getElementById: function (id) {
      let found = null;
      Data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    SetcurrentItem: function (item) {
      Data.currentItem = item;
    },
    getCurrentItem: function () {
      return Data.currentItem;
    },
    UpdateInputValue: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      Data.items.forEach(function (item) {
        if (Data.currentItem.id === item.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    DeleteCurrentItem: function (id) {
      const ids = Data.items.map(function (item) {
        return item.id;
      });
      // get the index
      const index = ids.indexOf(id);

      // splice the id

      Data.items.splice(index, 1);
    },
    clrAllItem: function () {
      Data.items = [];
    },
  };
})();

// UI CONTROLLER
const UICtrl = (function () {
  const UISelector = {
    ItemList: "#item-list",
    ItemLists: "#item-list li",
    AddBtn: ".add-btn",
    UpdateBtn: ".update-btn",
    DeleteBtn: ".delete-btn",
    BackBtn: ".back-btn",
    ClrBtn: ".clear-btn",
    ItemNameinput: "#item-name",
    ItemCaloriesinput: "#item-calorie",
    TotalCalories: ".total-calories",
  };

  // Public var
  return {
    PopulateItem: function (items) {
      let Html = "";

      items.forEach(function (item) {
        Html += `<li class="collection-item" id='item-${item.id}'>
  <strong>${item.name}: </strong> <em>${item.calories} calories</em>
  <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
</li>`;
      });

      document.querySelector(UISelector.ItemList).innerHTML = Html;
    },
    hideLIst: function () {
      document.querySelector(UISelector.ItemList).style.display = "none";
    },
    getInputValue: function () {
      const name = document.querySelector(UISelector.ItemNameinput).value;
      const calories = document.querySelector(
        UISelector.ItemCaloriesinput
      ).value;

      return {
        name,
        calories,
      };
    },

    getUISelectors: function () {
      return UISelector;
    },
    addItem: function (item) {
      // Show List Item
      document.querySelector(UISelector.ItemList).style.display = "block";
      // Create li
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i>`;

      document
        .querySelector(UISelector.ItemList)
        .insertAdjacentElement("beforeend", li);
    },
    UpdateItem: function (item) {
      let listItems = document.querySelectorAll(UISelector.ItemLists);
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        let itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
  <strong>${item.name}: </strong> <em>${item.calories} calories</em>
  <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
`;
        }
      });
    },
    DeleteAllItems: function () {
      let listItems = document.querySelectorAll(UISelector.ItemLists);
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        listItem.remove();
      });
    },
    clearInputs: function () {
      document.querySelector(UISelector.ItemNameinput).value = "";
      document.querySelector(UISelector.ItemCaloriesinput).value = "";
    },
    clearEditState: function () {
      UICtrl.clearInputs();
      document.querySelector(UISelector.AddBtn).style.display = "inline";
      document.querySelector(UISelector.UpdateBtn).style.display = "none";
      document.querySelector(UISelector.DeleteBtn).style.display = "none";
      document.querySelector(UISelector.BackBtn).style.display = "none";
    },
    ShowEditState: function () {
      document.querySelector(UISelector.AddBtn).style.display = "none";
      document.querySelector(UISelector.UpdateBtn).style.display = "inline";
      document.querySelector(UISelector.DeleteBtn).style.display = "inline";
      document.querySelector(UISelector.BackBtn).style.display = "inline";
    },
    displayCalories: function (totalCalories) {
      document.querySelector(UISelector.TotalCalories).textContent =
        totalCalories;
    },
    ShowCurrentItem: function (item) {
      document.querySelector(UISelector.ItemNameinput).value = item.name;
      document.querySelector(UISelector.ItemCaloriesinput).value =
        item.calories;
    },
    DeleteItem: function (id) {
      const itemID = `#item-${id}`;
      const list = document.querySelector(itemID);
      list.remove();
    },
  };
})();

//APP CONTROLLER
const APP = (function (ITEMCtrl, StorageCtrl, UICtrl) {
  // LoadAllEvent
  const LoadAllEvent = function () {
    const UiSelector = UICtrl.getUISelectors();
    // Disable enter key
    document.addEventListener("keypress", function (e) {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
      }
      return false;
    });
    // Add meal btn

    document
      .querySelector(UiSelector.AddBtn)
      .addEventListener("click", AddMealBtn);
    // Edit
    document
      .querySelector(UiSelector.ItemList)
      .addEventListener("click", ShowEditState);
    // update btn
    document
      .querySelector(UiSelector.UpdateBtn)
      .addEventListener("click", UpdateMeal);
    // Back btn
    document
      .querySelector(UiSelector.BackBtn)
      .addEventListener("click", UICtrl.clearEditState);
    // Delete btn
    document
      .querySelector(UiSelector.DeleteBtn)
      .addEventListener("click", DeleteMeal);
    // Clear btn
    document
      .querySelector(UiSelector.ClrBtn)
      .addEventListener("click", ClearAllItems);
  };

  const AddMealBtn = function (e) {
    const input = UICtrl.getInputValue();
    if (input.name !== "" && input.calories !== "") {
      const NewItem = ITEMCtrl.addItem(input.name, input.calories);
      UICtrl.addItem(NewItem);
      StorageCtrl.StoreItem(NewItem);
    }
    // Get Total Calories
    const totalCalories = ITEMCtrl.getTotalCalories();
    // Display Total Calories
    UICtrl.displayCalories(totalCalories);

    UICtrl.clearInputs();

    e.preventDefault();
  };

  const ShowEditState = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // get id of the parent-parent Node
      const li = e.target.parentNode.parentNode.id;
      // split the item into Array with - to get the id
      const liArr = li.split("-");
      // parseInt to confirm id is number
      const id = parseInt(liArr[1]);
      // get the item having the id
      const item = ITEMCtrl.getElementById(id);
      // set the item as the current item
      const currentItem = ITEMCtrl.SetcurrentItem(item);
      const currItem = ITEMCtrl.getCurrentItem(currentItem);
      // show the current item in the UI
      UICtrl.ShowCurrentItem(currItem);
      UICtrl.ShowEditState();
    }

    e.preventDefault();
  };

  const UpdateMeal = function (e) {
    // get the inputs
    const input = UICtrl.getInputValue();
    // update the input
    const updateItem = ITEMCtrl.UpdateInputValue(input.name, input.calories);
    // update the UI
    UICtrl.UpdateItem(updateItem);
    StorageCtrl.updateItemFromStorage(updateItem);

    // Get Total Calories
    const totalCalories = ITEMCtrl.getTotalCalories();
    // Display Total Calories
    UICtrl.displayCalories(totalCalories);
    //  Clear inputs
    UICtrl.clearInputs();
    //  Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  const DeleteMeal = function (e) {
    const currentItem = ITEMCtrl.getCurrentItem();
    ITEMCtrl.DeleteCurrentItem(currentItem.id);

    UICtrl.DeleteItem(currentItem.id);
    StorageCtrl.RemoveItemFromStore(currentItem.id);
    // Get Total Calories
    const totalCalories = ITEMCtrl.getTotalCalories();
    // Display Total Calories
    UICtrl.displayCalories(totalCalories);
    //  Clear inputs
    UICtrl.clearInputs();
    //  Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };
  const ClearAllItems = function (e) {
    // set items to empty array
    ITEMCtrl.clrAllItem();

    // remove all the loop of item
    UICtrl.DeleteAllItems();
StorageCtrl.clrAllItemFromStore()
    // Get Total Calories
    const totalCalories = ITEMCtrl.getTotalCalories();
    // Display Total Calories
    UICtrl.displayCalories(totalCalories);
    //  Clear inputs

    //  Clear Edit state
    UICtrl.clearEditState();
    //  hide the ul
    UICtrl.hideLIst();

    e.preventDefault();
  };

  // Public var
  return {
    Init: function () {
      // Clear Edit State
      UICtrl.clearEditState();
      const items = ITEMCtrl.getItem();

      if (items.length === 0) {
        UICtrl.hideLIst();
      } else {
        UICtrl.PopulateItem(items);
      }
      // Add  Total Calories to App Init
      const totalCalories = ITEMCtrl.getTotalCalories();
      //Add Display Total Calories to App Init
      UICtrl.displayCalories(totalCalories);

      LoadAllEvent();
    },
  };
})(ITEMCtrl, StorageCtrl, UICtrl);

APP.Init();
