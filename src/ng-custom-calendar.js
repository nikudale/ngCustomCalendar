(function(angular) {
  'use strict';
angular.module('ngCustomCalendar', [])
  .directive('weekCalendar', function() {
    return {
      restrict: 'E',
      templateUrl: 'week-calendar.html',
      link: function (scope) {
          scope.Calendar = {  cDay : moment().date(Number), 
                              cMonth : moment().format("MMMM") , 
                              cYear : moment().format("YYYY") ,
                              week :  { 
                                        days : [] , 
                                        position : 0,
                                        wFirstDay : moment()
                                      } ,
                              weekDaysTitle : ['Su','M','Tu','W','Th','F','Sa']
                      };
            var weekday = moment().weekday();
            scope.Calendar.week.wFirstDay = moment().add('days', -weekday );
            buildWeek(scope.Calendar.week);
            
            scope.Next = function () {
              console.log('Next click');
              scope.Calendar.week.position = scope.Calendar.week.position + 1;
              var weekDate = moment(scope.Calendar.week.wFirstDay).add((7 * scope.Calendar.week.position), 'days');
              //(weekDate.isSame(moment().set({'year': scope.Calendar.cYear, 'month': scope.Calendar.cMonth}), 'month')
              scope.Calendar.cMonth = weekDate.format("MMMM");
              scope.Calendar.cYear = weekDate.format("YYYY");
              buildWeek(scope.Calendar.week);
            };
            
            scope.Prev = function () {
              console.log('Prev click');
              scope.Calendar.week.position = scope.Calendar.week.position - 1;
              var weekDate = moment(scope.Calendar.week.wFirstDay).add((7 * scope.Calendar.week.position), 'days');
              scope.Calendar.cMonth = weekDate.format("MMMM");
              scope.Calendar.cYear = weekDate.format("YYYY");
              buildWeek(scope.Calendar.week);
            };
      }
    };
  })
  .directive('monthCalendar', function() {
    return {
      restrict: 'E',
      templateUrl: 'month-calendar.html',
      link: function (scope) {
          scope.Calendar = {  cDay : moment().date(Number), 
                              cMonth : moment().format("MMMM") , 
                              cYear : moment().format("YYYY") ,
                              month :  { 
                                    weeks : [6] , 
                                    position : 0 ,
                                    monthFirstWeekDate : moment().add(0, 'M').date(1)
                              } ,
                              weekDaysTitle : ['Su','M','Tu','W','Th','F','Sa']
                            };
            
            buildMonth(scope.Calendar.month);
            
            scope.Next = function () {
              console.log('Next click');
              scope.Calendar.month.position = scope.Calendar.month.position + 1;
              scope.Calendar.month.monthFirstWeekDate = moment().add(scope.Calendar.month.position, 'M').date(1);
              scope.Calendar.cMonth = moment(scope.Calendar.month.monthFirstWeekDate).format("MMMM");
              scope.Calendar.cYear = moment(scope.Calendar.month.monthFirstWeekDate).format("YYYY");
              buildMonth(scope.Calendar.month);
            };
            
            scope.Prev = function () {
              console.log('Prev click');
              scope.Calendar.month.position = scope.Calendar.month.position - 1;
              scope.Calendar.month.monthFirstWeekDate = moment().add(scope.Calendar.month.position, 'M').date(1);
              scope.Calendar.cMonth = moment(scope.Calendar.month.monthFirstWeekDate).format("MMMM");
              scope.Calendar.cYear = moment(scope.Calendar.month.monthFirstWeekDate).format("YYYY");
              buildMonth(scope.Calendar.month);
            };
      }
    };
  });
  
  
  angular.module('ngCustomCalendar').run([
    '$templateCache', function($templateCache) {
      $templateCache.put('month-calendar.html', "<div class=\"cal-containt\" >  <table class=\"table table-borderless\"> <tbody> <tr> <td><a data-ng-click=\"Prev()\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\" style=\"float:left;\"></span></a></td> <td align=\"center\"><span >{{Calendar.cMonth}} {{Calendar.cYear}}</span></td> <td><a data-ng-click=\"Next()\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\" style=\"float:right;\"></span></a></td> </tr> </tbody> </table>  <div class=\"table-responsive\"> <table class=\"table table-borderless\"> <thead> <tr> <th ng-repeat=\"day in Calendar.weekDaysTitle\">{{day}}</th> </tr> </thead> <tbody> <tr ng-repeat=\"week in Calendar.month.weeks\"> <td ng-repeat=\"date in week.days\" ng-class=\"(date.isCurrentMonth ? 'cMonth' : 'NotcMonth')+ ' ' + (date.isToday ? 'cToday' : 'NotcToday')\" ng-click=\"select()\">{{date.day}}</td> </tr>  </tbody> </table> </div>  </div>");
      $templateCache.put('week-calendar.html', "<div class=\"cal-containt\" >  <table class=\"table table-borderless\"> <tbody> <tr> <td><a data-ng-click=\"Prev()\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\" style=\"float:left;\"></span></a></td> <td align=\"center\"><span >{{Calendar.cMonth}} {{Calendar.cYear}}</span></td> <td><a data-ng-click=\"Next()\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\" style=\"float:right;\"></span></a></td> </tr> </tbody> </table>  <div class=\"table-responsive\"> <table class=\"table table-borderless\"> <thead> <tr> <th ng-repeat=\"day in Calendar.weekDaysTitle\">{{day}}</th> </tr> </thead> <tbody> <tr> <td ng-repeat=\"date in Calendar.week.days\" ng-class=\"(date.isCurrentMonth ? 'cMonth' : 'NotcMonth')+ ' ' + (date.isToday ? 'cToday' : 'NotcToday')\" ng-click=\"select()\">{{date.day}}</td> </tr>  </tbody> </table> </div>    </div>");
    }
  ]);
  
})(window.angular);


function buildMonth(month){
    var weeks = [6];
    var weekFirstDay = moment(month.monthFirstWeekDate).weekday();
    
    for(var i=0; i < 6; i++)
    {
        tempDay = (weekFirstDay === 0) ? -7 : -weekFirstDay;
        weeks[i] = {
            wFirstDay : moment(month.monthFirstWeekDate).add(tempDay, 'days'),
            position : i
          };
          console.log('wFirstDay'+weeks[i].wFirstDay.format());
        buildWeek(weeks[i], moment(month.monthFirstWeekDate));
        
    }
    month.weeks = weeks;
}

function buildWeek(week, cMonth){
    
    var days = [7]; 
    var date;
        
        //alert('first week day' + week.wFirstDay.date());
        for (var i = 0; i < 7; i++) {
            var dayofDays = (i + (7 * week.position));
            date = moment(week.wFirstDay).add(dayofDays, 'days');
            //alert('date'+ date.format());
            days[i] = {
                name: date.format("dd").substring(0, 1),
                day: date.date(),
                month: date.format("M"),
                year: date.format("YYYY"),
                isCurrentMonth: date.isSame(moment(cMonth), 'month'),
                isToday: moment(date.format('MM-DD-YYYY')).isSame(moment().format('MM-DD-YYYY')),
                date: date
            };
            console.log('date month'+date.month()+' week month'+moment(cMonth).month() + ' isCurrentMonth'+days[i].isCurrentMonth);
        }
    week.days = days;
    //return week;
  }