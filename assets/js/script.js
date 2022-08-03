//TO DO: add current day  and time to jumbotron✔
//TO DO: renderDiaryEntries();✔
//TO DO: get current hour from moments✔
//TO DO: change middle column from a div to a textarea DONE ✔
//TO DO: add an event listner to the save button  ✔
//TO DO: store the item to local storage ✔
//TO Do: turn the floppy disk green for save (nice to have)❌
// display a notification to say that data has been stored ✔
//TO DO: store the item to local storage ✔
//TO DO: display the task in the text area ✔
//TO DO: add a strike through to the text items (nice to have)❌
//To Do: change the size of the floppy disk icon  (nice to have)❌
//To Do: add function to periodically update the timeBlocks ✔
//To Do: Change the timeBlocks font type and size ✔

/*The renderDiaryEntries() function fetches the user stored schedular events from the local storage and displays the text. Stored entires are removed from local storage if the date property of the hourEntry object is older than the current date.*/
function renderDiaryEntries() {
  console.log("inside render items");

  //get the stored arrary of objects
  var storedDiaryEvents = JSON.parse(localStorage.getItem('diaryEvents'));  
  
  //loop through each array object and render to screen  
  for( i = 0; i < storedDiaryEvents.length; i++){
    console.log(storedDiaryEvents[i].text);
    console.log(i);
      //display all stored events for current day
      var hour = storedDiaryEvents[i].hour;
      if(storedDiaryEvents[i].date == moment().format('L')) {
        $('#' + hour).children('.description').val(storedDiaryEvents[i].text);
        //console.log("#" + hour);
      } 
      else if(storedDiaryEvents[i].date != moment().format('L')) {
        //remove entries older than current date and update local storage
          storedDiaryEvents.splice(i, 1);
          console.log(storedDiaryEvents.length);
          localStorage.setItem("diaryEvents", JSON.stringify(storedDiaryEvents));
      }
    }          
  
}

/*This function is called from the saveBtn listner function, it firstly checks to see if an array exists in local storage, if not, stores an empty array in local storage.*/
function storeDiaryText(text, hour) {
  //check if a diaryEvents array already exists in local storage
  if(localStorage.getItem("diaryEvents") == null){

    localStorage.setItem('diaryEvents', '[]');
  }
  console.log("inside storeDiaryText");
  
  //get the stored array of objects
  var storedDiaryEvents = JSON.parse(localStorage.getItem('diaryEvents'));

  //check to see if an entry already exists in storage. I use the find.index method here since only one object entry exits for each hour in the schedular. This helped reduce previously used for loop with if else statements to a few lines of code - result:-)!
  let updateIndex = storedDiaryEvents.findIndex(entry => entry.hour === hour);
  //-1 indicates no matching entry - in this case a new object is created for the hour corresponding to the saveBtn event.  
  if(updateIndex == -1) {
    //entry not in local storage for this hour - add entry to local storage
    var hourEntry = {

      "hour": hour,
      "text": text,
      "date": moment().format('L')
    };
    //add object to the array of objects
    storedDiaryEvents.push(hourEntry);
    //update local storage
    localStorage.setItem("diaryEvents", JSON.stringify(storedDiaryEvents));

  } else {
    //entry already exists the user has updated or overwritten the current entry - update text and date object property values only.

    storedDiaryEvents[updateIndex].text = text;
    storedDiaryEvents[updateIndex].date = moment().format('L');
    //update local storage
    localStorage.setItem("diaryEvents", JSON.stringify(storedDiaryEvents));
  }
  //display save message to the user for a finite time 
  $('#saved').addClass('display');

  //remove message after a short delay  
  setTimeout(function() {$('#saved').removeClass('display')} ,2000);
  //Display the stored data to the screen
  renderDiaryEntries();
}

/*This event occurs for any one of the hour blocks when the user selects the save button. */
$('.saveBtn').on('click', function() {

  /*select the previous element to the event button (which is the text area)  and assign the text area string to textEl.*/

  let textEl = $(this).prev().val();
    
  //get the value of the data attribute from the button parent container.  Here the value of the data attribute is used - the data attribute corresponds to a block hour.
  let idEl = $(this).parent().attr('data-id');
   
  //call storeDiaryText() to store timeBlock info. to local storage, the text string and value of the data-id are passed as arguments to storeDiaryText(textEl, idEl).
  storeDiaryText(textEl, idEl);
  
});

/*This function updates the date and time displayed in the jumbotron */ 
function setJumboClock() {
  $('#currentDay').text(moment().format('LLLL'));
    console.log("updating clock");
    
  }


  function updateTimeBlocks() {
    //select all time blocks
    let timeBlockEl = $(".time-block");
    //get the the data attribute value from the parent container
    
    //get the current hour from Moments
    var currentHour = moment().hours();
    
    //loop through timeBlock; for each entry, get the value of the data attribute (this corresponds to the hour), test whether it is past, current or in the future add the corresponding class and remove previous  timeBLock. class. These classes are used in css to change the timeBlock colour
    for(var i=0; i<timeBlockEl.length; i++){
      var element = timeBlockEl.eq(i);
          
      if(element.attr("data-id") < currentHour) {
        element.addClass("past");   
        element.removeClass("present");
        element.removeClass("future");   
      } else if (element.attr("data-id") == currentHour){
        element.addClass("present");
        element.removeClass("past");
        element.removeClass("future");
      } else if (element.attr("data-id") > currentHour) {
        element.addClass("future");  
        element.removeClass("present");
        element.removeClass("past")
        
      }    
      //console.log(element.attr("data-id") + ", " +currentHour + ", " + moment().format('LT'));
    }
    //console.log("updating timeBlocks" +", "+ moment().format('LT'));
    
  } 
  
// call setJumboClock  to display the date and current time   
setJumboClock();

//Call updateTimeBlocks() to set and change the colour of the time blocks depending on the current time
updateTimeBlocks();

//Call renderDiaryEntries() to retrieve and display planner entries saved in local storage
renderDiaryEntries();


//update Jumbotron Clock every 10 seconds
setInterval(setJumboClock, 10000);

//updateTimeBlocks() every 30 seconds;
setInterval(updateTimeBlocks, 30000);

