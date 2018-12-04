//SECTION FIREBASE
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAsBSMWdIEzARseH2Ar2_L3B-z3pxUeSJs",
    authDomain: "trademark-c83fc.firebaseapp.com",
    databaseURL: "https://trademark-c83fc.firebaseio.com",
    projectId: "trademark-c83fc",
    storageBucket: "trademark-c83fc.appspot.com",
    messagingSenderId: "18387554473"
};
firebase.initializeApp(config);
var database = firebase.database();


//Variables
var symbol;
var stockName;
var lastPrice;
var todayHigh;
var todayLow;
var percentChange;
var openPrice;
var volume;
var exchange;

$(document).ready(function () {
    $("#advancedDetails").hide();
});


//Functions
// SECTION: WATCHLIST TABLE
$("#submitButton").on("click", function (event) {
    $("#advancedDetails").show();
    event.preventDefault();
    var barchartAPIkey = 'b07ee9357cf8f37a122e8176286d33c7';

    symbolInput = $("#symbolInput").val().trim();
    console.log("Input", symbolInput);
    var onDemand = new OnDemandClient();


    var barchartAPIkey = 'b07ee9357cf8f37a122e8176286d33c7';
    onDemand.setAPIKey(barchartAPIkey);
    onDemand.setJsonP(true);
    onDemand.getQuote({ symbols: symbolInput }, function (err, data) {
        var quotes = data.results;
        console.log("Results", data.results);
        if (data.results != null) {
            for (x in quotes) {
                symbol = quotes[x].symbol;
                stockName = quotes[x].name;
                lastPrice = quotes[x].lastPrice;
                todayHigh = quotes[x].high;
                todayLow = quotes[x].low;
                percentChange = quotes[x].percentChange;
                openPrice = quotes[x].open;
                volume = quotes[x].volume;
                exchange = quotes[x].exchange;
            };
            advancedDetails();

            database.ref().push({
                symbol: symbol,
                stockName: stockName,
                lastPrice: lastPrice,
                percentChange: percentChange,
                openPrice: openPrice,
                todayHigh: todayHigh,
                todayLow: todayLow,
            });
            $("#symbolInput").val("");
            $("#errorReport").text(`You selected ${stockName}. The symbol for ${stockName} is ${symbol}. Today's high price for ${symbol} is $${todayHigh}, today's low is $${todayHigh}.`);
            $('#errorReport').addClass("animated flash");
        }
        else {
            console.log("else part");
            $("#errorReport").text("Please Enter A Valid Stock Symbol. For example, AAPL is the symbol for Apple. MSFT is the symbol for Microsoft.");
            $('#errorReport').addClass("animated flash");
        }
    });
});
// Firebase is generating the table at this point
database.ref().on("child_added", function addToTable(stockSnapshot) {
    $("tbody").prepend("<tr><th scope='row'>" + stockSnapshot.val().stockName + "</th> <td>" + "$" + stockSnapshot.val().lastPrice + "</td> <td>" + stockSnapshot.val().percentChange + "%" + "</td> <td>" + "$" + stockSnapshot.val().todayHigh + "</td> <td>" + "$" + stockSnapshot.val().todayLow + "</td></tr>");
});
// firebase displays the most recent stock that was added. I tried changing it to an on click event but i kept getting undefined, or table is undefined or database.ref().val() is not a function
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    $("#symbolLine").text(symbol);
    $("#companyName").text(snapshot.val().stockName);
    $("#currentPrice").text("Current Price: " + snapshot.val().lastPrice);
    $("#todayHigh").text("Today's High: " + snapshot.val().todayHigh);
    $("#todayLow").text("Today's Low: " + snapshot.val().todayLow);
    $("#yearHigh").text("52 Week High: " + snapshot.val().fiftyTwoWkHigh);
    $("#yearLow").text("52 Week Low: " + snapshot.val().fiftyTwoWkLow);
    $("#dividendRate").text("Dividend Rate: " + snapshot.val().dividendRate);
    $("#dividendExDate").text("Dividend EX-Date: " + snapshot.val().exDividendDate);
});

function advancedDetails() {
    //need to call firebase info stored from above
    $("#symbolLine").text(symbol);
    $("#companyName").text(stockName);
    $("#currentPrice").text("Current Price: $" + lastPrice);
    $("#todayHigh").text("Today's High: $" + todayHigh);
    $("#todayLow").text("Today's Low: $" + todayLow);
    $("#openPrice").text("Opening Price: $" + openPrice);
    $("#volume").text("Volume: " + volume);
    $("#exchange").text("Exchange: " + exchange);
}

$('tbody').on('click', 'tr', function (e) {
    e.preventDefault();
    $(this).closest('tr').remove();
});

$("#stockStories").on("click", function () {
    var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
    url += '?' + $.param({
        'api-key': "19da8eb38b624ff896f16eb1eeaf9261",
        "q": "finance"
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        for (var i = 0; i < result.results.length; i++) {
            var articleDiv = $("<div class='article'>");

            var imgURL = result.results[i].multimedia[0].url;
            var image = $("<img>").attr("src", imgURL);
            articleDiv.append(image);

            var title = result.results[i].title;
            var pOne = $("<p>").text(title);
            articleDiv.append(pOne);

            var abstract = result.results[i].abstract;
            var pTwo = $("<p>").text(abstract);
            articleDiv.append(pTwo);

            var url = result.results[i].url;
            var result = url.link(url);
            var pThree = $("<p>").html(result);

            articleDiv.append(pThree);
            $("#articles-view").addClass("resourceContainer");
            $("#articles-view").prepend(articleDiv);

        }

    }).fail(function (err) {
        throw err;
    });

});