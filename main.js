import express from 'express'

const app = express()

//array of todos 
let todos = [
  {
    id: 1,
    title: 'Zajít na pivo',
    done: true,
  },
  {
    id: 2,
    title: 'Vrátit se z hospody',
    done: false,
  },
]

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('Incomming request', req.method, req.url)
  next()
})

//get all todos 
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Todos',
    todos,
  })
})

//detail jednoho todo 
app.get('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === todoId);
  
    if (!todo) {
      res.status(404).send('TODO neexistuje');
      return;
    }
  
    res.render('todo', {
      title: 'Todo Detail',
      todo,
    });
  });

//edit názvu todo 
  app.post('/edit-todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
  
    if (todoIndex === -1) {
      res.status(404).send('TODO neexistuje');
      return;
    }
  
    todos[todoIndex].title = req.body.title;
  
    res.redirect('/');
  });


//přidat todoo do arraye a přesměrování zpět 
app.post('/add-todo', (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    done: false,
  }

  todos.push(todo)

  res.redirect('/')
})


//odebrat todo a přesměrování zpět 
app.get('/remove-todo/:id', (req, res) => {
  todos = todos.filter((todo) => {
    return todo.id !== Number(req.params.id)
  })

  res.redirect('/')
})

//změna stavu todo 
app.get('/toggle-todo/:id', (req, res) => {
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id)
  })

  todo.done = !todo.done

  res.redirect('/')
})

//erros 
app.use((req, res) => {
  res.status(404)
  res.send('404 - Page not found')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send('500 - Server error')
})

//app
app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})