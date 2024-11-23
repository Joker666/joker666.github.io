---
title: Generics in Rust with Monomorphization
excerpt: Generics in Rust is not like in any other mainstream programming language except for C++ and uses something called Monomorphization. This approach is fantastic since it is basically zero cost.
isFeatured: true
publishDate: "Aug 25 2023"
tags:
  - rust
  - generics
  - optimization
---

Generics in Rust is not like in any other mainstream programming language except for C++ and uses something called `Monomorphization` for compile-time generics. This approach is fantastic since it is [zero cost](https://joker666.github.io/blog/2023-08-06-zero-cost-abstraction-rust) but if we are not careful it can lead to code bloat. We discussed Rust's runtime polymorphism in a [different article](https://www.hasanrafi.com/articles/what-is-dyn-in-rust-and-how-it-powers-polymorphism).

So what is generics? In simple words, it means parameterized types. The idea is to allow types to be parameters to structs, functions, traits, methods, etc. Let's consider a function that swaps elements in an array:

```rust
// Non-generic function to swap elements in an integer array
fn swap_int_elements(array: &mut [i32], index1: usize, index2: usize) {
    if index1 < array.len() && index2 < array.len() {
        array.swap(index1, index2)
    }
}

fn main() {
    let mut int_array = [1, 2, 3, 4, 5];
    println!("Original int_array: {:?}", int_array);
    swap_int_elements(&mut int_array, 1, 3);
    println!("After swapping: {:?}", int_array);
}

// Output
// Original int_array: [1, 2, 3, 4, 5]
// After swapping: [1, 4, 3, 2, 5]
```

Now what if we needed to swap strings?

```rust
// Non-generic function to swap elements in an string array
fn swap_string_elements(array: &mut [&str], index1: usize, index2: usize) {
    if index1 < array.len() && index2 < array.len() {
        array.swap(index1, index2)
    }
}

fn main() {
    let mut string_array = ["apple", "banana", "cherry"];
    println!("Original string_array: {:?}", string_array);
    swap_string_elements(&mut string_array, 0, 2);
    println!("After swapping: {:?}", string_array);
}

// Output
// Original string_array: ["apple", "banana", "cherry"]
// After swapping: ["cherry", "banana", "apple"]
```

We can quickly see that we can use a function for swapping elements in an array that also takes the type as a parameter. Enter generic functions:

## Generic function

We will refactor the above two functions into one and take the type (`int` or `str`) as a parameter as well.

```rust
// A generic function to swap elements in an array
fn swap_elements<T>(array: &mut [T], index1: usize, index2: usize) {
    if index1 < array.len() && index2 < array.len() {
        array.swap(index1, index2);
    }
}

fn main() {
    // Example with integers
    let mut int_array = [1, 2, 3, 4, 5];
    println!("Original int_array: {:?}", int_array);
    swap_elements(&mut int_array, 1, 3);
    println!("After swapping: {:?}", int_array);

    // Example with strings
    let mut string_array = ["apple", "banana", "cherry"];
    println!("Original string_array: {:?}", string_array);
    swap_elements(&mut string_array, 0, 2);
    println!("After swapping: {:?}", string_array);
}

// Output
// Original int_array: [1, 2, 3, 4, 5]
// After swapping: [1, 4, 3, 2, 5]
// Original string_array: ["apple", "banana", "cherry"]
// After swapping: ["cherry", "banana", "apple"]
```

We have headfirst dived into the generics implementation but let's discuss it now. In the code above, the function `swap_elements` is defined with a generic type parameter `T`. This parameter allows the function to work with arrays containing elements of any type. Now having this abstraction, one might wonder what is the performance hit for this. The good news is, it's zero. Rust achieves this zero-cost abstraction through a process called `Monomorphization`.

## Monomorphization

This is a big name for a simple process that the Rust compiler performs. It generates separate concrete implementations of generic functions or types for each set of type parameters used at compile time. This eliminates the need for runtime type checks or [dynamic dispatch](https://www.hasanrafi.com/articles/what-is-dyn-in-rust-and-how-it-powers-polymorphism).

For our example, when the Rust compiler encounters the generic function `swap_elements`, it doesn't immediately generate code for every possible type `T` that could be used with the function. Instead, it generates specialized versions of the function for the concrete types that are used. In our case it's `i32` and `&str` since there are two invocations of `swap_elements`: one with an integer array and another with a string array in the `main` function. So the monomorphized version will look exactly like what we handcoded in the typed-out versions.

```rust
// i32
fn swap_elements_i32(array: &mut [i32], index1: usize, index2: usize) {
    if index1 < array.len() && index2 < array.len() {
        let temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    }
}

// &str
fn swap_elements_str(array: &mut [&str], index1: usize, index2: usize) {
    if index1 < array.len() && index2 < array.len() {
        array.swap(index1, index2);
    }
}
```

## Generic struct and method

You can store a generic type in a `struct` as well:

```rust
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
}
```

One thing to note is that we've used only one generic type to define `Point<T>`. That means `x` and `y` are both have to be the same type.

```rust
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let wont_work = Point { x: 5, y: 4.0 };
}

// error: expected integer, found floating-point number
```

If `x` is `int` and `y` is `float` it won't compile. If we want it, it is simple to achieve with another generic type parameter.

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let both_integer = Point { x: 5, y: 10 };
    let both_float = Point { x: 1.0, y: 4.0 };
    let integer_and_float = Point { x: 5, y: 4.0 };
}
```

When you want to add an implementation for the generic `struct`, you declare the type parameter after the `impl`:

```rust
impl<T> Point<T> {
    fn swap(&mut self) {
        std::mem::swap(&mut self.x, &mut self.y);
    }
}

fn main() {
    let mut int_origin = Point { x: 0, y: 1 };
    println!("Original int_array: {:?}", int_origin);
    int_origin.swap();
    println!("Swapped int_array: {:?}", int_origin);
}

// Original int_array: Point { x: 0, y: 1 }
// Swapped int_array: Point { x: 1, y: 0 }
```

Why multiple `<T>`? First, we declare the type parameter (`T`) after the `impl` keyword (`impl<T>`), and then we use other `T`s to refer to that first `T`: to specify the struct type we are implementing (`Point<T>`).

## Generic enum

Generics can be applied to `enums` as well. One of the two most common `enums` that we encounter while reading Rust codes or writings are `Option` and `Result` implemented in Rust core.

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Then we use it like:

```rust
fn main() {
    let o1: Option<i32> = Some(1);
    let o2: Option<&str> = Some("two");
    let o3: Option<bool> = Some(true);
    let o4: Option<f64> = Some(4.0);
}
```

## Takeaway

Generics in Rust is quite powerful. We just scratched the surface here. In some other articles, we will explore more advanced Generics features of Rust. The best part about it is, that you don't need to worry about the runtime performance of it. However, having too many generics can lead to slow compile time and bloating of binary. [Trait objects](https://www.hasanrafi.com/articles/what-is-dyn-in-rust-and-how-it-powers-polymorphism) offer the flexibility of faster compile time at the cost of runtime performance. But it's not a bad thing, in all other languages Generic types are checked at runtime. In the end, it depends on your specific implementation.
