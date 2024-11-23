---
title: "Golang Concurrency And Workerpool: Part 2"
excerpt: Concurrency limiting worker pool. We deep dive into building a robust worker pool.
image:
  {
    src: "https://hackernoon.com/images/3Ur17PtJhkV5UkAAJFu6z8t0fKg1-cz631ep.jpeg",
    alt: "Worker pool",
  }
publishDate: "Dec 04 2020"
tags:
  - golang
  - concurrency
  - workerpool
---

![logo](https://hackernoon.com/images/3Ur17PtJhkV5UkAAJFu6z8t0fKg1-cz631ep.jpeg)

**Project Link: [https://github.com/Joker666/goworkerpool](https://github.com/Joker666/goworkerpool)**

[Concurrency in Golang and WorkerPool: [Part 1\]](https://joker666.github.io/golang-concurrency-and-workerpool-part-1.html)

Goroutines and channels are powerful language structs that make golang a powerful concurrent language. In the first part of the article, we explored, how we can build a workerpool to optimize the performance of the concurrency structs of golang namely limiting the resource utilization. But it was a simple example to demonstrate how we can go about it.

Here, we will build a robust solution according to the learning from the first part so that we can use this solution in any application. There are some solutions on the internet with complex architecture using dispatchers and all. In reality, we do not need it, we can do everything using one shared channel. Let's see how we can build that here

## Architecture

Here we make a generic workerpool package that can handle tasks with workers based on the desired concurrency. Let's see the directory structure.

```
workerpool
├── pool.go
├── task.go
└── worker.go
```

The `workerpool` directory is in the root folder of the project. Let's go over what `Task` is. `Task` is a single unit of work that needs to be processed. `Worker` is a simple worker function that handles running the task. And `Pool` actually handles the creation and managing the workers.

## Implementation

Let's code out `Task` first.

```go
// workerpool/task.go

package workerpool

import (
    "fmt"
)

type Task struct {
    Err  error
    Data interface{}
    f    func(interface{}) error
}

func NewTask(f func(interface{}) error, data interface{}) *Task {
    return &Task{f: f, Data: data}
}

func process(workerID int, task *Task) {
    fmt.Printf("Worker %d processes task %v\n", workerID, task.Data)
    task.Err = task.f(task.Data)
}
```

`Task` is a simple stuct that holds everything needed to process a task. We pass it the `Data` and the function `f` that is supposed to be executed. And `process` function executes the task. The function `f` takes the Data as a parameter for processing. And we also store the error that is returned. Let's see how `Worker` processes these tasks.

```go
// workerpool/worker.go

package workerpool

import (
    "fmt"
    "sync"
)

// Worker handles all the work
type Worker struct {
    ID       int
    taskChan chan *Task
}

// NewWorker returns new instance of worker
func NewWorker(channel chan *Task, ID int) *Worker {
    return &Worker{
        ID:       ID,
        taskChan: channel,
    }
}

// Start starts the worker
func (wr *Worker) Start(wg *sync.WaitGroup) {
    fmt.Printf("Starting worker %d\n", wr.ID)

    wg.Add(1)
    go func() {
        defer wg.Done()
        for task := range wr.taskChan {
            process(wr.ID, task)
        }
    }()
}
```

We have a nice little struct `Worker` here. It takes a worker ID and a channel where tasks should be written to. In the `Start` method, we range over the `taskChan` for incoming tasks to process inside a goroutine. We can imagine, multiple of this workers would be running concurrently and handling tasks.

## Worker Pool

We have implemented the `Task` and `Worker` to handle tasks but there's a missing piece here. Who's gonna spawn up these workers and send them tasks. The answer: Worker Pool

```go
// workerpoo/pool.go

package workerpool

import (
    "fmt"
    "sync"
    "time"
)

// Pool is the worker pool
type Pool struct {
    Tasks   []*Task

    concurrency   int
    collector     chan *Task
    wg            sync.WaitGroup
}

// NewPool initializes a new pool with the given tasks and
// at the given concurrency.
func NewPool(tasks []*Task, concurrency int) *Pool {
    return &Pool{
        Tasks:       tasks,
        concurrency: concurrency,
        collector:   make(chan *Task, 1000),
    }
}

// Run runs all work within the pool and blocks until it's
// finished.
func (p *Pool) Run() {
    for i := 1; i <= p.concurrency; i++ {
        worker := NewWorker(p.collector, i)
        worker.Start(&p.wg)
    }

    for i := range p.Tasks {
        p.collector <- p.Tasks[i]
    }
    close(p.collector)

    p.wg.Wait()
}
```

The worker pool holds all the tasks that it needs to process and takes a concurrency number as input to spawn that many numbers of goroutines to complete the tasks concurrently. It has a buffered channel `collector` which is shared among all the workers.

So, when we run this worker pool, we spawn the desired number of workers that take the shared channel `collector`. Next, we range over the tasks and write it to the `collector` channel. We synchronize everything with waitgoup. Now that we have a nice solution, let's test it out

```go
// main.go

package main

import (
    "fmt"
    "time"

    "github.com/Joker666/goworkerpool/workerpool"
)

func main() {
    var allTask []*workerpool.Task
    for i := 1; i <= 100; i++ {
        task := workerpool.NewTask(func(data interface{}) error {
            taskID := data.(int)
            time.Sleep(100 * time.Millisecond)
            fmt.Printf("Task %d processed\n", taskID)
            return nil
        }, i)
        allTask = append(allTask, task)
    }

    pool := workerpool.NewPool(allTask, 5)
    pool.Run()
}
```

Here, we create 100 tasks and use 5 as concurrency to process them. And see the output

```bash
Worker 3 processes task 98
Task 92 processed
Worker 2 processes task 99
Task 98 processed
Worker 5 processes task 100
Task 99 processed
Task 100 processed
Took ===============> 2.0056295s
```

It takes us two seconds to process 100 tasks, if we increase the concurrency to 10, we would see that it would take just about one second to process all the tasks.

We have built a robust solution for worker pool that can handle concurrency, store errors to task, send them data to process. This package is generic and not coupled to a specific implementation. We can use this to tackle large problems as well

## Extending Further: Handling Tasks In Background

We can actually extend our solution further, so that, the workers keep waiting for new tasks in the background and we can send them new tasks to process. For that, Task stays as is, but we would need to modify `Worker` a bit. Let's see the changes

```go
// workerpool/worker.go

// Worker handles all the work
type Worker struct {
    ID       int
    taskChan chan *Task
    quit     chan bool
}

// NewWorker returns new instance of worker
func NewWorker(channel chan *Task, ID int) *Worker {
    return &Worker{
        ID:       ID,
        taskChan: channel,
        quit:     make(chan bool),
    }
}

....

// StartBackground starts the worker in background waiting
func (wr *Worker) StartBackground() {
    fmt.Printf("Starting worker %d\n", wr.ID)

    for {
        select {
        case task := <-wr.taskChan:
            process(wr.ID, task)
        case <-wr.quit:
            return
        }
    }
}

// Stop quits the worker
func (wr *Worker) Stop() {
    fmt.Printf("Closing worker %d\n", wr.ID)
    go func() {
        wr.quit <- true
    }()
}
```

We add a `quit` channel to `Worker` struct and two new methods. `StartBackgorund` would start an infinite for loop with `select` to read from `taskChan` and process the task. If it reads from `quit` channel it, returns from the function. `Stop` method writes to the `quit` channel.

Armed with these two new methods let's add some new things to `Pool`.

```go
// workerpool/pool.go

type Pool struct {
    Tasks   []*Task
    Workers []*Worker

    concurrency   int
    collector     chan *Task
    runBackground chan bool
    wg            sync.WaitGroup
}

// AddTask adds a task to the pool
func (p *Pool) AddTask(task *Task) {
    p.collector <- task
}

// RunBackground runs the pool in background
func (p *Pool) RunBackground() {
    go func() {
        for {
            fmt.Print("⌛ Waiting for tasks to come in ...\n")
            time.Sleep(10 * time.Second)
        }
    }()

    for i := 1; i <= p.concurrency; i++ {
        worker := NewWorker(p.collector, i)
        p.Workers = append(p.Workers, worker)
        go worker.StartBackground()
    }

    for i := range p.Tasks {
        p.collector <- p.Tasks[i]
    }

    p.runBackground = make(chan bool)
    <-p.runBackground
}

// Stop stops background workers
func (p *Pool) Stop() {
    for i := range p.Workers {
        p.Workers[i].Stop()
    }
    p.runBackground <- true
}
```

The `Pool` struct now holds the workers and has a `runBackground` channel that can help it to stay alive. We have 3 new methods, `AddTask` can add to `collector` channel anytime now.

The `RunBackground` method spawns a goroutine that runs infinitely to keep the Pool alive along with `runBackground` channel. This is a technique to run the execution forever to read from an empty channel. We spin up the workers in goroutines. Stop method, stops the workers, it writes to `runBackground` to finish the `RunBackground` method. Let's see how it works now.

If we had a real world scenario, this would be running alongside a HTTP server and consuming tasks. We would replicate similar behavior with an infinite loop and it would stop if it matches a certain condition

```go
// main.go

...

pool := workerpool.NewPool(allTask, 5)
go func() {
    for {
        taskID := rand.Intn(100) + 20

        if taskID%7 == 0 {
            pool.Stop()
        }

        time.Sleep(time.Duration(rand.Intn(5)) * time.Second)
        task := workerpool.NewTask(func(data interface{}) error {
            taskID := data.(int)
            time.Sleep(100 * time.Millisecond)
            fmt.Printf("Task %d processed\n", taskID)
            return nil
        }, taskID)
        pool.AddTask(task)
    }
}()
pool.RunBackground()
```

When we run this, we would see a random task is getting inserted while the workers are running in the background, and one of the workers picking the task up. It would eventually stop when it matches the condition to stop.

## Conclusion

We explored how we can build a robust solution with worker pool from the naive one in the first part. Also, we extended further to implement the worker pool running in the background to handle further incoming tasks.
