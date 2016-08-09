let app = require('./server');

let port = process.env.PORT || 80
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
