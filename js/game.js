    function sortArray(inputArray, method)	{

        var outputArray = [];

    	for	(var i=0;i<inputArray.length-1;i++) {
    		var	minIndex = i;
    		for(var	j=i+1; j<inputArray.length; j++)	{
    			if(inputArray[j]<inputArray[minIndex]) minIndex=j;
    		};
    		var	num	= inputArray[minIndex];
    		inputArray[minIndex] = inputArray[i];
    		inputArray[i]=num;
    	};

        if(method==0)
            outputArray = inputArray;
        else
            outputArray = inputArray.reverse();

    	return outputArray;
    }

    var RandomNumberGameViewModel2 = function () {
        var page = this;

        Level = function (id, identifier) {
            return {
                id: ko.observable(id),
                identifier: ko.observable(identifier)
            };
        }

        this.GenerateRandomNumber = function () {
            var number = '';
            for (var i = 0; i < this.digitsLimit() ; i++) {
                var randomNumber = Math.floor((Math.random() * this.digitsLimit()) + 1);
                number += randomNumber;
            }
            return number;
        }

        page.GetAttemptsLimit = function (levelValue) {
          return levelValue == 2 ? 7 :
                   levelValue == 3 ? 9 : 4;
      
        }

        page.GetDigitsLimit = function (levelValue) {
            return levelValue == 2 ? 7 :
                   levelValue == 3 ? 9 : 4;
        }

        page.checkInput = function (data, event) {
            return (event.charCode >= 49 &&
               event.charCode < 49 + page.digitsLimit()) || event.charCode == 0;
        }

        page.GetDashboard = function (resultArray) {
            var dashboardArray = [];
            if (!resultArray) {
                for (var i = 0; i < page.digitsLimit() ; i++) {
                    dashboardArray.push('?');
                }
            }
            else {
                for (var j = 0; j < page.digitsLimit() ; j++) {
                    if (resultArray[j].flag() == true) {
                        dashboardArray.push(resultArray[j].number);
                    }
                    else {
                        dashboardArray.push('?');
                    }
                }
            }
            return dashboardArray;
        }

        page.Result = function (indexValue, numberValue, flagValue) {

            return {
                index: ko.observable(indexValue),
                number: ko.observable(numberValue),
                flag: ko.observable(flagValue)
            };
        }

        page.Results = function (attemptValue, inputNumberValue, resultArrayValue) {		
            return {
                attempt: attemptValue,
                number: inputNumberValue,
                resultIndex: resultArrayValue
            };
        }

        page.GetResult = function (randomNumber, userInput) {
            var arrayOfRandomNumber = randomNumber.split('');
            var arrayOfUserInput = userInput.split('');

            var result = [];
            for (var index = 0; index < arrayOfRandomNumber.length; index++) {
                var flag = arrayOfRandomNumber[index] == arrayOfUserInput[index];
                var number = arrayOfRandomNumber[index];
                result.push(new page.Result(index, number, flag));
            }

            return result;
        }

        page.RestartGame = function (gameLevel) {
            page.attemptsLimit(page.GetAttemptsLimit(gameLevel));
            page.digitsLimit(page.GetDigitsLimit(gameLevel));
            page.randomNumber = page.GenerateRandomNumber();
            page.inputNumber('');
            page.attempts(page.attemptsLimit());
            page.results([]);
            page.dashboard(page.GetDashboard(''));
        }

        page.sortByOrder = function () {
    			page.results.reverse(); 
        }
        
    	page.sortByCorrect = function () {
    		var ori_results = page.results();	 
    		var numIdx = [];
    	
    		var correctNums = 0;      			
    		for (var index = 0; index < page.results().length; index++) {
    			    
    			if(page.results()[index].resultIndex=='none') {
    				correctNums = 0;
    			}	else {
    				try {
    					correctNums = page.results()[index].resultIndex.split(',').length;
    				} catch(e) {
    					correctNums=1;
    				}
    			}
    			numIdx.push(correctNums);
    		}
    	
          try{
            var oriIdx = []; oriResults = [];
            for(var i=0; i<numIdx.length;i++) {
                 oriIdx[i] = numIdx[i];	
            };
            for(var i=0; i<page.results().length; i++) {
                 var tmpResults = new page.Results(
                     page.results()[i].attempt,
                     page.results()[i].number,
                     page.results()[i].resultIndex
                     );
                 oriResults.push(tmpResults);
             }

             sortArray(numIdx,1); 

             page.results.removeAll();       
             for(var i=0; i<numIdx.length;i++) {
                 var finded = 0; 
                 for( var j=0; j<oriIdx.length;j++) {
                    if(numIdx[i]==oriIdx[j] && finded==0) {
                       var tmpResults = new page.Results(
                           oriResults[j].attempt,
                           oriResults[j].number,
                           oriResults[j].resultIndex
                           );
                       oriIdx[j] = -1;
                       finded = 1;
                       page.results.push(tmpResults);					
                   }
               };
            };
            } catch(e){alert(e);}
    	}
       

        page.OnEnterClick = function () {
            var resultArray = page.GetResult(
                page.randomNumber, page.inputNumber());
            var digitsCorrectCount = 0;
            var resultArrayIndex = '';
            if (resultArray.length > 0) {
                for (var i = 0; i < resultArray.length; i++) {
                    if (resultArray[i].flag() == true) {
                        var index = i + 1;
                        digitsCorrectCount++;
                        if (!resultArrayIndex)
                            resultArrayIndex = index;
                        else {
                            appendValue = ',' + index;
                            resultArrayIndex += appendValue;
                        }
                    }
                }

                if (resultArrayIndex.length == 0)
                    resultArrayIndex = 'none';

                var newResults = new page.Results(
                        page.results().length + 1,
                        page.inputNumber(),
                        resultArrayIndex
                        );
                
                page.results.push(newResults);                   




                var attemptsRemaining = page.attempts() - 1;
                page.inputNumber('');
                page.attempts(attemptsRemaining);
                page.dashboard(page.GetDashboard(resultArray));

                if (digitsCorrectCount == page.digitsLimit()) {
                    alert('Congratulation!!！  you guessed it correct!!!!');
                    page.RestartGame(page.selectedLevel());
                }
                else if (page.attempts() == 0 && digitsCorrectCount < page.digitsLimit()) {
                    alert('HahaHaha...you missed it... Sorry... better luck next time...');
                    page.RestartGame(page.selectedLevel());
                }
            }

            page.inputFocus(true);
        }

        page.levels = ko.observableArray([new Level(1, 'Level_1'),
            new Level(2, 'Level_2'), new Level(3, 'Level_3')]);
        page.selectedLevel = ko.observable();
        page.attemptsLimit = ko.observable(0);
        page.digitsLimit = ko.observable(0);
        page.randomNumber = 0;
        page.dashboard = ko.observableArray(page.GetDashboard(''));
        page.inputNumber = ko.observable('');
        page.inputFocus = ko.observable(true);
        page.enableEnter = ko.computed(function () {
            return page.inputNumber().length == page.digitsLimit();
        }, self);
        page.attempts = ko.observable(page.attemptsLimit());
        page.results = ko.observableArray([]);
        page.newresults = ko.observableArray([]);

        page.selectedLevel.subscribe(function (newValue) {
            ko.utils.arrayForEach(page.levels(), function (item) {
                if (item.id() == newValue) {
                    page.RestartGame(item.id());
                }
            });
        });
    }


    $(function () {
        ko.applyBindings(new RandomNumberGameViewModel2());
    });