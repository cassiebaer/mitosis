let app = require('./server');

let port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
