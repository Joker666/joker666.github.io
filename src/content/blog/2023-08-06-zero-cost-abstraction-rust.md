---
title: Zero cost abstraction in Rust
excerpt: Zero cost abstraction is a fancy term that simply means that adding high-level constructs like a newtype, type class or generics do not contribute to any runtime cost.
publishDate: "Aug 06 2023"
isFeatured: true
tags:
  - rust
  - optimization
---

Zero-cost abstraction is a fancy term that simply means that adding high-level constructs like a `newtype`, iterators, traits, or [generics](https://joker666.github.io/blog/2023-08-25-generics-in-rust-with-monomorphization) do not
contribute to any runtime cost. Zero-cost abstractions don't make anything faster, rather they make the runtime the same
as if you wrote the lower-level unabstracted version (usually at the expense of compile time). You can write expressive,
high-level code without incurring runtime overhead. This is fantastic because in most other programming languages
abstractions are expensive.

Let's see an example with `traits`:

```rust
trait Foo {
    fn foo(&self) -> u32;
}

struct Bar;

impl Foo for Bar {
    fn foo(&self) -> u32 {
        123
    }
}

fn main() {
    let bar = Bar;
    let foo = bar.foo();
    println!("{}", foo);
}
```

Here the `Bar` struct implements `Foo` the trait. But the `Foo` trait never exists in runtime. The `foo` method is
implemented for `Bar`, so the compiler can generate efficient machine code for the call. Rust uses a technique called
`Static Dispatch` and with that the compiler knows the concrete type at compile time and generates specialized code for
each type implementing the trait, resulting in direct function calls. The trait we created is a zero-cost abstraction -
it uses no more CPU, RAM, or code space to track the state of `Foo`, it has no actual representation in memory at
runtime.

But the idea is not new. In fact, the zero-overhead principle is a C++ design principle that states:

- You don't pay for what you don't use.
- What you do use, you couldn't hand code any better.

This is different from other popular programming languages like Go, Python, Ruby, Java etc. In Go, to handle
`goroutines` all Go binaries come with a scheduler and a runtime for managing goroutines even if you never use it.
In Rust, the `async` runtime is an optional package if you need the async features.

Let's see another example with `iterators`. Here we sum the even numbers of an array:

```rust
fn sum_even_numbers1(numbers: &[i32]) -> i32 {
    numbers.iter().filter(|&&x| x % 2 == 0).sum()
}

fn sum_even_numbers2(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for &number in numbers {
        if number % 2 == 0 {
            sum += number;
        }
    }
    sum
}
```

The first function uses `iterator` and borrows functional programming concepts to compute the sum concisely. It's also
easier to understand. But even though we use an `iterator` and `filter` through it to allocate another array of even
numbers to get its sum, the compiler generates the same assembly code as the second function.

Generics are also implemented without any runtime overhead in Rust with a technique called _`Monomorphization`_ which we
will discuss in a [different article](https://joker666.github.io/blog/2023-08-25-generics-in-rust-with-monomorphization).

## Takeaway

You don't have to feel guilty about doing abstractions anymore in Rust. Don't rush to optimize runtime performance,
rather invest in abstractions, software design, and code readability.
