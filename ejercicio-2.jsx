/*
  Ejercicio 2 con redux
*/

const like = (state, action) => {
  switch (action.type){
    case 'ADD':
      return {
        id: action.id,
        like: action.like,
        unlike: action.unlike,
        title: action.title,
        description: action.description,
        image: action.image,
        likeCount: 0,
        unlikeCount: 0
      }
    case 'LIKE':
      if(state.id !== action.id){
        return state;
      }
      return {
        ...state,
        like: !state.like,
        unlike: !state.like ? false : state.unlike
      };
    case 'UNLIKE':
      if(state.id !== action.id){
        return state;
      }
      return {
        ...state,
        like: !state.unlike ? false : state.like,
        unlike: !state.unlike,
        unlikeCount: !state.unlike ? state.unlikeCount + 1 : state.likeCount - 1,
        likeCount: !state.like ? state.likeCount + 1 : state.likeCount - 1
      };
    default:
      return state;
  }
};

const likes = (state = [], action) => {
  switch (action.type){
    case 'ADD':
      return [
        ...state,
        like(undefined, action)
      ]
    case 'LIKE':
      return state.map(t => like(t, action));
    case 'UNLIKE':
      return state.map(t => like(t, action));
    default:
      return state;
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    const { list, store } = this.props;

    list.map((movie, index) => {
      store.dispatch({
        type: 'ADD',
        id: index,
        like: movie.like,
        unlike: movie.unlike,
        title: movie.title,
        description: movie.description,
        image: movie.image
      })
    });

    this.state = {
      moviesLength: list.length,
      likeCount: 0,
      unlikeCount: 0
    }
  }


  componentDidMount(){
    const { store } = this.props;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  // Desmontamos el subscribe
  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    const state = this.props.store.getState();
    console.log('state en App', state)
    const count = state.map((movie, index) => {
      return {
        likeCount: !movie.like ? this.state.likeCount + 1 : this.state.likeCount - 1,
        unlikeCount: !movie.unlike ? this.state.unlikeCount + 1 : this.state.unlikeCount - 1
      }
    });
    return(
      <section className="container">
        <MovieList list={ this.props.list }
              store={ this.props.store }
              onLikeClick={id =>
                this.props.store.dispatch({
                  type: 'LIKE',
                  id
                })
              }

              onUnLikeClick={id =>
                this.props.store.dispatch({
                  type: 'UNLIKE',
                  id
                })
              }
            />

        <Footer all={ this.state.moviesLength }
           likeCount={ this.state.likeCount }
           unlikeCount={ this.state.unlikeCount }/>
      </section>
    );
  }
}

class MovieList extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const { list, store, onLikeClick, onUnLikeClick} = this.props;
    const state = store.getState();

    const listMovies = state.map((movie, index) => {
                        // console.log('Hola movie -> ', movie)
                        return <Movie { ...movie } key={ index }
                                        onLike={() =>
                                          onLikeClick(index)
                                        }
                                        onUnlike={() =>
                                          onUnLikeClick(index)
                                        }
                                        />
                      });
    // console.log('lista de movies -> ', listMovies)
    return(
      <ul className="movieList">
        { listMovies }
      </ul>
    );
  }
}

// Puedo llevarme un component a otro project
class Movie extends React.Component {

  render(){
    const {
      image,
      description,
      title,
      onLike,
      onUnlike,
      state,
      like,
      unlike
    } = this.props;

    // const state = store.getState();
    // console.log('state -> ', state);
    // console.log('state like  -> ', like);
    return(
      <li className="Movie">
        <figure className="Movie-image">
          <img height="160px" width="110" src={ image } />
        </figure>
        <div className="Movie-content">
          <div className="Movie-meta">
            <h2>{ title }</h2>
            <p>{ description }</p>
          </div>
          <div className="Movie-actions">
            <span onClick={onLike} className={`icon-like ${like ? 'is-liked' : '' }`}>&#10003;</span>
            <span  onClick={onUnlike} className={`icon-unlike ${unlike ? 'is-unliked' : '' }`}>&#10005;</span>
          </div>
        </div>
      </li>
    );
  }
}

// Otra forma de pasar los objectos directamente como si fueran los props
const Footer = ({ likeCount, unlikeCount, all }) => {
  // const { likeCount, unlikeCount, all } = this.props;
  return(
    <footer className="footer">
      <p>Likes: <span className="likes">{ likeCount }</span></p>
      <p>Unlikes: <span className="unlikes">{ unlikeCount }</span></p>
      <p>Total: <span className="total">{ all }</span></p>
    </footer>
  )
}

// Un array de objects
const data = [
  {
    id: 0,
    title: "Wonder Woman",
    description: "Antes de ser Wonder Woman ...",
    like: false,
    unlike: false,
    image: "https://image.tmdb.org/t/p/w300/yjzHtHSAPDdRQejnTyFbifX2gef.jpg"
  },
  {
    id: 1,
    title: "The Mummy",
    like: false,
    unlike: false,
    description: "A pesar de estar enterrada en ...",
    image: "https://image.tmdb.org/t/p/w300/6kCPiZ0eG3BoWvxgTq2Z8AYnEo.jpg"
  },
  {
    id: 2,
    title: "Piratas del caribe",
    like: false,
    unlike: false,
    description: "Empujado hacia una nueva aventura ...",
    image: "https://image.tmdb.org/t/p/w300/gB3cNhpfxEWSjiKSGOv8nlmVdeu.jpg"
  },
  {
    id: 3,
    title: "Logan",
    like: false,
    unlike: false,
    description: "Sin sus poderes, por primera vez ...",
    image: "https://image.tmdb.org/t/p/w300//5pAGnkFYSsFJ99ZxDIYnhQbQFXs.jpg"
  },
  {
    id: 4,
    title: "John Wick",
    like: false,
    unlike: false,
    description: "Sin sus poderes, por primera vez ...",
    image: "https://image.tmdb.org/t/p/w300/sl3QSDb7rB6dS4wzJoTJbhCVvVF.jpg"
  },
  {
    id: 5,
    title: "Guardianes de la Galaxia",
    like: false,
    unlike: false,
    description: "Sin sus poderes, por primera vez ...",
    image: "https://image.tmdb.org/t/p/w300/9Ju7p4daJi5rcTUghYZxHlP15ia.jpg"
  },
  {
    id: 6,
    title: "Alien: Covenant",
    like: false,
    unlike: false,
    description: "Sin sus poderes, por primera vez ...",
    image: "https://image.tmdb.org/t/p/w300/ewVHnq4lUiovxBCu64qxq5bT2lu.jpg"
  }
]

const { createStore } = Redux;
const app = document.getElementById('app');

ReactDOM.render(
  <App list={ data } store={ createStore(likes) }/>,
  app
);