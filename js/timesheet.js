$(document).ready(function() {
  fetchTimesheetInfo();

  function fetchTimesheetInfo() {
    $.ajax({
      // Update with prod URL
      url: "http://private-dbebc-timesheet9.apiary-mock.com/timesheets",
      crossDomain: true
    }).then(function(data) {
      displayTimesheetInfo(data);
    });
  }

  function displayTimesheetInfo(timesheetInfo) {
    var daysEntries = collateDays(timesheetInfo.timeEntryPositionMapByDate);
    displayDays(daysEntries);
  }

  function collateDays(timeEntryProjectInfo) {
    var daysEntries = {};

    function fetchDayEntry(date) {
      var dayEntry = daysEntries[date];
      if (!dayEntry) {
        dayEntry = [];
        daysEntries[date] = dayEntry;
      }
      return dayEntry;
    }

    timeEntryProjectInfo.forEach(function(projectInfo) {
      var positionName = projectInfo.position.name;
      var positionNote = projectInfo.position.note;
      projectInfo.timeEntries.forEach(function(timeEntry) {
        var date = timeEntry.date;
        var dayEntry = fetchDayEntry(date);
        dayEntry.push({
          id: timeEntry.id,
          date: date,
          hours: timeEntry.hours,
          projectedHours: timeEntry.projectedHours,
          positionName: positionName,
          positionNote: positionNote,
          positionId: timeEntry.position.id
        });
      });
    });
    return daysEntries;
  }

  function displayDays(daysEntries) {
    function sortDaysEntryDates(daysEntries) {
      var dates = [];
      for (date in daysEntries) {
        if (daysEntries.hasOwnProperty(date)) {
          dates.push(date);
        }
      }
      dates.sort();
      return dates;
    }

    function constructDayElement(daysEntry, date) {
      function constructDayWrapper() {
        var dayElement = document.createElement("div");
        dayElement.className = "day";
        return dayElement;
      }

      function constructDayHeader(date) {
        var dayHeader = document.createElement("h2");
        dayHeader.innerHTML = date;
        return dayHeader;
      }

      var dayElement = constructDayWrapper();
      dayElement.insertAdjacentElement('afterbegin', constructDayHeader(date));
      return dayElement;
    }

    var daysElement = $(".days");
    var sortedDates = sortDaysEntryDates(daysEntries);
    sortedDates.forEach(function(date) {
      daysElement.append(constructDayElement(daysEntries[date], date));
    });
  }
});
