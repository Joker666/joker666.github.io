---
title: "Golang Concurrency And Workerpool: Part 1"
excerpt: Concurrency limiting worker pool. We deep dive into building a simple workerpool solution.
publishDate: "Nov 27 2020"
tags:
  - golang
  - concurrency
  - workerpool
  - software engineering
---

![logo](https://hackernoon.com/images/3Ur17PtJhkV5UkAAJFu6z8t0fKg1-cz631ep.jpeg)

**Project Link: [https://github.com/Joker666/goworkerpool](https://github.com/Joker666/goworkerpool)**

In modern programming languages concurrency has become an unequivocal need. Almost all programming languages today have some method of concurrency. Some have really powerful constructs, that can offload works to different threads in the OS, e.g., Java, some mimic this behavior in the same thread, e.g., Ruby.

Golang has a very powerful concurrency model called CSP (communicating sequential processes), which breaks a problem into smaller sequential processes and then schedules several instances of these processes called Goroutines. The communication between these processes happens by passing immutable messages via Channels.

Here we will explore, how we can take advantage of concurrency in golang and how we can limit its usage with worker pools. In the second part, we will explore how to build a robust solution for concurrency around this concept.

## A Simple Case

Let's imagine we have an external API call which takes about 100ms to get done. If we have 1000 of these calls, and we call these synchronously, it would take about **100s** to complete

```go
//// model/data.go

package model

type SimpleData struct {
    ID int
}

//// basic/basic.go

package basic

import (
    "fmt"
    "time"

    "github.com/Joker666/goworkerpool/model"
)

func Work(allData []model.SimpleData) {
    start := time.Now()
    for i, _ := range allData {
    	Process(allData[i])
    }
    elapsed := time.Since(start)
    fmt.Printf("Took ===============> %s\n", elapsed)
}

func Process(data model.SimpleData) {
    fmt.Printf("Start processing %d\n", data.ID)
    time.Sleep(100 * time.Millisecond)
    fmt.Printf("Finish processing %d\n", data.ID)
}

//// main.go

package main

import (
    "fmt"

    "github.com/Joker666/goworkerpool/basic"
    "github.com/Joker666/goworkerpool/model"
    "github.com/Joker666/goworkerpool/worker"
)

func main() {
    // Prepare the data
    var allData []model.SimpleData
    for i := 0; i < 1000; i++ {
    	data := model.SimpleData{ ID: i }
    	allData = append(allData, data)
    }
    fmt.Printf("Start processing all work \n")

    // Process
    basic.Work(allData)
}
```

```bash
Start processing all work
Took ===============> 1m40.226679665s
```

Here, we have a simple model that holds a data struct with just an integer value. We process an array of this data synchronously. This is obviously not an optimum solution since these tasks can be processed concurrently. Let's turn this into an asynchronous process with goroutines and channels.

## Asynchronous

```go
//// worker/notPooled.go

func NotPooledWork(allData []model.SimpleData) {
    start := time.Now()
    var wg sync.WaitGroup

    dataCh := make(chan model.SimpleData, 100)

    wg.Add(1)
    go func() {
    	defer wg.Done()
    	for data := range dataCh {
            wg.Add(1)
            go func(data model.SimpleData) {
                defer wg.Done()
                basic.Process(data)
            }(data)
        }
    }()

    for i, _ := range allData {
        dataCh <- allData[i]
    }

    close(dataCh)
    wg.Wait()
    elapsed := time.Since(start)
    fmt.Printf("Took ===============> %s\n", elapsed)
}

//// main.go

// Process
worker.NotPooledWork(allData)
```

```bash
Start processing all work
Took ===============> 101.191534ms
```

Here, we create a buffered channel of 100 and add all the data passed to `NoPooledWork` to the channel. Since it is a buffered channel, it would not be able to enter any more data than 100 until data is extracted from it. Which we do it inside a goroutine. We range over the channel, extract data from it, add a goroutine, and process. There's no limit to how many goroutines we are creating here. This can process as many tasks as passed. Theoretically, it is possible to handle as much data as possible given the resources needed. If we run this, **we complete 1000 tasks around** **100ms**. Crazy right. Not quite.

## The Problem

Unless we have all the resources on earth, we have limited allocations we can do for a given period of time. The minimal size of a goroutine object is 2K, but it can reach up to 1GB. The above solution runs all the tasks concurrently and let's say for a million of these tasks, it can quickly run out of memory and CPU of the machine. Either we have to upgrade our machine or find a different solution.

Computer scientists have thought about this problem long before and came up with a brilliant solution called Thread Pool or Worker Pool. The idea is to have a limited pool of workers to process the tasks. Once a worker is done processing one task, it goes for handling the next task. So tasks keep waiting to be processed. This reduces the burst on CPU and memory and rather distributes the tasks over time.

## The Solution: Worker Pool

Let's fix the earlier problem with worker pool implementation

```go
//// worker/pooled.go

func PooledWork(allData []model.SimpleData) {
    start := time.Now()
    var wg sync.WaitGroup
    workerPoolSize := 100

    dataCh := make(chan model.SimpleData, workerPoolSize)

    for i := 0; i < workerPoolSize; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()

            for data := range dataCh {
                basic.Process(data)
            }
        }()
    }

    for i, _ := range allData {
        dataCh <- allData[i]
    }

    close(dataCh)
    wg.Wait()
    elapsed := time.Since(start)
    fmt.Printf("Took ===============> %s\n", elapsed)
}

//// main.go

// Process
worker.PooledWork(allData)
```

```bash
Start processing all work
Took ===============> 1.002972449s
```

Here, we have a limited number of worker size, 100. We spin up exactly 100 goroutines to process the tasks. We can think of channels as queues and each worker goroutine is a consumer. Multiple goroutines can listen to the same channel but each item on a channel would be processed just once.

> Channels work like queue in Golang

This is a nice solution, if we run it, we see it takes **1s** to finish all the tasks. Not quite 100ms, but we don't need it. We get a much better solution that distributes the load over time.

## Handling Error

We are not quite done yet. This looks like a complete solution except it isn't. We are not handling errors here. So let's create a scenario where we have to handle errors and let's see how we can go about it.

```go
//// worker/pooledError.go

func PooledWorkError(allData []model.SimpleData) {
    start := time.Now()
    var wg sync.WaitGroup
    workerPoolSize := 100

    dataCh := make(chan model.SimpleData, workerPoolSize)
    errors := make(chan error, 1000)

    for i := 0; i < workerPoolSize; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()

            for data := range dataCh {
                process(data, errors)
            }
        }()
    }

    for i, _ := range allData {
        dataCh <- allData[i]
    }

    close(dataCh)

    wg.Add(1)
    go func() {
        defer wg.Done()
        for {
            select {
            case err := <-errors:
                fmt.Println("finished with error:", err.Error())
            case <-time.After(time.Second * 1):
                fmt.Println("Timeout: errors finished")
                return
            }
        }
    }()

    defer close(errors)
    wg.Wait()
    elapsed := time.Since(start)
    fmt.Printf("Took ===============> %s\n", elapsed)
}

func process(data model.SimpleData, errors chan<- error) {
    fmt.Printf("Start processing %d\n", data.ID)
    time.Sleep(100 * time.Millisecond)
    if data.ID % 29 == 0 {
        errors <- fmt.Errorf("error on job %v", data.ID)
    } else {
        fmt.Printf("Finish processing %d\n", data.ID)
    }
}

//// main.go

// Process
worker.PooledWorkError(allData)
```

We have modified our `process` method to handle some randomized errors and add it to the passed `errors` channel. So, to handle errors in a concurrent model, we need `errors` channel to hold the error data. After all the tasks are done processing, we check the `errors` channel for errors. The error object holds ID of the task so that if needed, we can process those again.

This is a better solution than the one which was not handling errors at all. But we are not done with it yet, in the second part, we will go over how we can make a dedicated worker pool package that is robust and can handle concurrent tasks with a limiting worker pool number.

## Exercise

We don't always want to keep processing our tasks if multiple tasks keep failing. Indicates that we have a deeper issue to resolve first. For exercise, you can try to improve the last solution to stop processing tasks, when there are more than 2 tasks that have resulted in an error. Send pull request in the original [repo](https://github.com/Joker666/goworkerpool) when you find a solution and I will send a review for that.

## Conclusion

Golang's concurrency model is powerful enough to just build a worker pool solution without much overhead, that's why it's not included in the standard library. But we can spin up our own solution that fits our needs. I will write the next article very soon. Til then, stay tuned.
