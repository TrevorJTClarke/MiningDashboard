var express =       require('express')
    , bodyParser =  require('body-parser')
    , http =        require('http')
    , path =        require('path')
    , ejs =         require('ejs')
    , request =     require('request')
    , fs =          require("fs");

var app = express();
var cache;

// Known mining pools:
const pools = {
  flypool: 'https://zcash.flypool.org/api/miner_new/'
}

// request('https://api.cryptowat.ch/markets/poloniex/zecusd/sparkline', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public/'))

app.get('/', function(req, res){
  res.render('index');
});

app.get('/:type/:id', function(req, res){
  if (!req.params || !req.params.type || !req.params.id) {
    res.send('invalid params')
    return;
  }
  let params = req.params
  let host = ''

  if (params.type === 'zec') host = pools.flypool

  if (!host) {
    res.send('invalid host')
    return;
  }

  request(host + params.id, function (error, response, body) {
    console.log('error:', error)
    if (error) {
      res.send(error)
      return;
    }
    res.json(body)
  });
});

app.all('/*', function(req, res){
  res.send('🤑');
});


app.set('port', process.env.PORT || 1234);
http.createServer(app).listen(app.get('port'), function(){
  console.log("Server Started");
  console.log("http://localhost:" + app.get('port'));
});
