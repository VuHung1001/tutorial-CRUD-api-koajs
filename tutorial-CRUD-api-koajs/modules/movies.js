const Router = require('koa-router');
const fs = require('fs')

const router = Router({
  prefix: '/movies'
});  //Prefixed all routes with /movies

const movies = JSON.parse(fs.readFileSync('data.json', 'utf8')).movies;

//Routes will go here
router.get('/', sendMovies);
router.get('/:id([0-9]{3,})', sendMovieWithId);
router.post('/', addNewMovie);
router.put('/:id', updateMovieWithId);
router.delete('/:id', deleteMovieWithId);

// Middle wares
function sendMovies(ctx, next){
  ctx.body = movies;
}

function sendMovieWithId(ctx, next){
  const currMovie = movies.filter(function(movie){
     if(movie.id === ctx.params.id*1){
        return true;
     }
  });

  if(currMovie.length === 1){
     ctx.body = currMovie[0];
  } else {
     ctx.response.status = 404; // Set status to 404 as movie was not found
     ctx.body = {message: "Not Found"};
  }
}

function addNewMovie(ctx, next){
  //Check if all fields are provided and are valid:
  if(!ctx.request.body.name || 
     !ctx.request.body.year.toString().match(/^[0-9]{4}$/g) || 
     !ctx.request.body.rating.toString().match(/^[0-9]\.[0-9]$/g)
  ){
     
     ctx.response.status = 400;
     ctx.body = {message: "Bad Request"};
  } else {
     const newId = movies[movies.length-1].id*1+1;
     
     movies.push({
        id: newId,
        name: ctx.request.body.name,
        year: ctx.request.body.year*1,
        rating: ctx.request.body.rating*1
     });
     ctx.body = {message: "New movie created.", location: "/movies/" + newId};
  }
}

function updateMovieWithId(ctx, next){
  //Check if all fields are provided and are valid:
  if(!ctx.request.body.name || 
     !ctx.request.body.year.toString().match(/^[0-9]{4}$/g) || 
     !ctx.request.body.rating.toString().match(/^[0-9]\.[0-9]$/g) ||
     !ctx.params.id.toString().match(/^[0-9]{3,}$/g)
  ){
     
     ctx.response.status = 400;
     ctx.body = {message: "Bad Request"};
  } else {
     //Gets us the index of movie with given id.
     const updateIndex = movies.map(function(movie){
        return movie.id;
     }).indexOf(parseInt(ctx.params.id*1));

     if(updateIndex === -1){
        //Movie not found, create new
        movies.push({
           id: ctx.params.id*1,
           name: ctx.request.body.name,
           year: ctx.request.body.year*1,
           rating: ctx.request.body.rating*1
        });

        ctx.body = {message: "New movie created.", location: "/movies/" + ctx.params.id};    
     } else {
        //Update existing movie
        movies[updateIndex] = {
          id: ctx.params.id*1,
          name: ctx.request.body.name,
          year: ctx.request.body.year*1,
          rating: ctx.request.body.rating*1
        };

        ctx.body = {message: "Movie id " + ctx.params.id + " updated.", location: "/movies/" + ctx.params.id};
     }
  }
}

function deleteMovieWithId(ctx, next){
  let removeIndex = movies.map(function(movie){
     return movie.id;
  }).indexOf(ctx.params.id*1); //Gets us the index of movie with given id.
  
  if(removeIndex === -1){
     ctx.body = {message: "Not found"};
  } else {
     movies.splice(removeIndex, 1);
     ctx.body = {message: "Movie id " + ctx.params.id + " removed."};
  }
}

module.exports = router;