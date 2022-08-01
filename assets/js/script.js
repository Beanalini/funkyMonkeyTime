//add current day  and time to jumbotron✔
//renderDiaryEntries();✔
//TO DO: get current hour from moments✔
//TO DO: change middle column from a div to a textarea DONE ✔
//TO DO: add an event listner to the save button  ✔
//TO DO: store the item to local storage ✔
//TO Do: turn the floppy disk green for save
// display a notification to say that data has been stored (use a jquery UI notification box)
//TO DO: display the task in the text area ✔
//TO DO: add a strike through to the text items
//To Do: change the size of the floppy disk icon 
//To Do: add function to periodically update the timeBlocks
//Change the timeBlocks font type and size

setJumboClock();
updateTimeBlocks();

$('.saveBtn').on('click', function() {
  //get the string from the text area element
  let textEl = $(this).prev().val();
    
  //get the value of the data attribute from the button parent container
  let idEl = $(this).parent().attr('data-id');
   
  //call storeDiaryText() to store timeBlock info. to local storage
  storeDiaryText(textEl, idEl);

  
  //call render to screen function
  //renderDiaryEntries();
});


  

  function renderDiaryEntries() {
    console.log("inside render items");

    //get the stored arrary of objects
    var storedDiaryEvents = JSON.parse(localStorage.getItem('diaryEvents'));
    
    
    //loop through each array object and render to screen
    
    for( i = 0; i < storedDiaryEvents.length; i++){
      console.log(storedDiaryEvents[i].text);
      console.log(i);
        var hour = storedDiaryEvents[i].hour;
        if(storedDiaryEvents[i].date == moment().format('L')) {
          $('#' + hour).children('.description').val(storedDiaryEvents[i].text);
          console.log("#" + hour);
        } 
        else if(storedDiaryEvents[i].date != moment().format('L')) {
  
                    console.log(storedDiaryEvents.length);
                storedDiaryEvents.splice(i, 1);
                console.log(storedDiaryEvents.length);
                localStorage.setItem("diaryEvents", JSON.stringify(storedDiaryEvents));
        }
      }          
    
  }

  function storeDiaryText(text, hour) {

    if(localStorage.getItem("diaryEvents") == null){

      localStorage.setItem('diaryEvents', '[]');
    }
    console.log("inside storeDiaryText");
    //get the date and month from moments

    //get the stored arrary of objects
    var storedDiaryEvents = JSON.parse(localStorage.getItem('diaryEvents'));

    //check to see if an entry already exists in storage
    let updateIndex = storedDiaryEvents.findIndex(entry => entry.hour === hour);
    //-1 indicates no matching entry
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
      //entry already exists - update text and date object property values only

      storedDiaryEvents[updateIndex].text = text;
      storedDiaryEvents[updateIndex].date = moment().format('L');
      //update local storage
      localStorage.setItem("diaryEvents", JSON.stringify(storedDiaryEvents));
    }
    renderDiaryEntries();
  }

function updateTimeBlocks() {
  //select all time blocks
  let timeBlockEl = $(".time-block");
  //get the the data attribute value from the parent container
  var hour = $(".time-block").attr("data-id");
  //get the current hour from Moments
  var currentHour = moment().hours();

  //loop through timeBlock; for each entry, get the value of the data attribute (this corresponds to the hour), test whether it is past, current or in the future and add the corresponding class to the timeBLock. These classes are used in css to change timeBlock colour
  for(var i=0; i<timeBlockEl.length; i++){
    var element = timeBlockEl.eq(i);
        
    if(element.attr("data-id") < currentHour) {
      var element = timeBlockEl.eq(i);      
      element.addClass("past");
    } else if (element.attr("data-id") == currentHour){
      var element = timeBlockEl.eq(i);      
      element.addClass("present");
    } else if (element.attr("data-id") > currentHour) {
      var element = timeBlockEl.eq(i); 
      element.addClass("future");     
    }    
  }
} 
function setJumboClock() {
  $('#currentDay').text(moment().format('LLLL'));
  }
//update Jumbotron Clock every 10 seconds
setInterval(setJumboClock, 10000);

//updateTimeBlocks() every 30 seconds;
setInterval(updateTimeBlocks, 30000);
renderDiaryEntries();