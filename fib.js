function fib(nth) {
  //
  let first = 1;
  let next = 1;
  let third;

  for (let index = 2; index < nth; index++) {
    // next = first + next;
    third = first + next;
    first = next;
    next = third;
  }
  console.log(next);
}

// inser
fib(77);
