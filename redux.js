// Este en teoria es el reducer donde estas las opciones dependiendo del type de action.
const counter = (state = 0, action) => {
  switch (action.type){
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const { createStore } = Redux;
// var createStore = Redux.createStore(counter);
// import { createStore } from 'redux';
const store = createStore(counter);

// console.log(store.getState());
// store.dispatch({ type: 'INCREMENT' });
// console.log(store.getState());

/*
 // Example 1
const render = () => {
  document.body.innerHTML = store.getState();
}

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});*/

/*
  Example 2
*/

// Podemos usar parentesis en vez de llaves para no usar el return
// const Counter = (props) => (
//   <h1>{props.value}</h1>
// );

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{ value }</h1>
    <button onClick={ onIncrement }>+</button>
    <button onClick={ onDecrement }>-</button>
  </div>
);

const increment = {
  type: 'INCREMENT'
}

const decrement = {
  type: 'DECREMENT'
}

const render = () => {
  // ReactDOM.render(
  //   <Counter
  //     value={ store.getState() }
  //     onIncrement={ () =>
  //       store.dispatch({
  //         type: 'INCREMENT'
  //       })
  //     }
  //     onDecrement={ () =>
  //       store.dispatch({
  //         type: 'DECREMENT'
  //       })
  //     }
  //   />,
  //   document.getElementById('app')
  // );

  ReactDOM.render(
    <Counter
      value={ store.getState() }
      onIncrement={ () =>
        store.dispatch(increment)
      }
      onDecrement={ () =>
        store.dispatch(decrement)
      }
    />,
    document.getElementById('app')
  )
}

store.subscribe(render);
render();

// Nota: El estado deberia siempre mantenerse es decir nunca mutarlo sino que el estado anterior permanesca,
// Y solo se agregue un nuevo estado a un array.

/*
  Example 3
*/

// Mantemos siempre el state anterior en este caso.
const reducer = (state = [], action) => {
  switch (action.type){
    case 'add_to_array':
      return [action.payload];
    case 'add_one_more':
      return [...state, action.payload];
    default:
      return state;
  }
}

const { createStore } = Redux;
// var createStore = Redux.createStore(counter);
// import { createStore } from 'redux';
const store = createStore(reducer);

store.getState();

const action = {
  type: 'add_to_array',
  payload: 'ReduxIsAwesome'
}
const action2 = {
  type: 'add_one_more',
  payload: 'And fun'
}
store.dispatch(action);
store.dispatch(action2);
document.body.innerHTML = store.getState();

/*
 Example 4
*/

const todo = (state, action) => {
  switch (action.type){
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      // !== no es igual o no es del mismo type
      // Esto se hace para verificar que es id si existe,
      // Si no es igual va dar true
      if(state.id !== action.id){
        return state;
      }
      // Cambiamos el completed que esta como false a true
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

// Llamos un reducer todo para agregar el nuevo state,
// En este reducer todos vamos guardando todos los estados anteriores
const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

// Un reducer para filtrar
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type){
    case 'SET_VISIBILITY_FILTER':
      // console.log(action.filter)
      // Aca llega el tipo de filtro Ej: SHOW_ACTIVE
      return action.filter;
    default:
      return state;
  }
};

// Con esto podemos tener varios reducers
const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});
// Creamos el stote del los reducers
const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React;

// Un Component basado en function resivimos los props directamente
const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  // Validamos que el filter que me llega es el mismo que currentFilter
  // Si es así enviamos es un span en vez de un <a>.
  if(filter === currentFilter){
    return <span>{children}</span>
  }
  return <a href='#'
            onClick={ e => {
              e.preventDefault();
              store.dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter
              })
            }}
          >
            { children }
        </a>
};

// Un reducer donde manejamos los types de filters
const getVisibleTodos = (todos, filter) => {
  switch (filter){
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      // Este filter es una function propia de JavaScript
      // Entonces donde t.completed sea true
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      // Aca es lo mismo si es true lo cambia a false entonces ese no es Activate
      return todos.filter(t => !t.completed);
  }
}

// Con el dispatch despachamos el reducer todos
let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    const {
      todos,
      visibilityFilter
    } = this.props; // Recibimos los props
    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );
    return (
      <div className='container'>
        <input ref={text => {
          this.input = text;
        }} />
        <button onClick={ () => {
            store.dispatch({
              type: 'ADD_TODO',
              text: this.input.value,
              id: nextTodoId++
            });
            this.input.value = '';
          }}>
            Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo =>
            <li key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}>
              {todo.text}
            </li>
          )}
        </ul>
        {/* Con el { ' ' } dejamos un espacio al lado. */}
        <p>
          Show:
          { ', ' }
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>
            All
          </FilterLink>
          { ', ' }
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>
            Activate
          </FilterLink>
          { ', ' }
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </p>
      </div>
    );
  }
}


/*
  Nota: Cada vez que dispara el dispatch se activa o vuelve a correr
    el store.subscribe(render);
  Todo lo que venga ... todos={store.getState().todos}
  visibilityFilter={store.getState().visibilityFilter}
*/
const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()}/>,
    document.getElementById('app')
  );
};
// Suscribimos la funcion render.
store.subscribe(render);
render();
