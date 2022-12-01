function asyncHandler(fn) {
  return function (...args) {
    fn(...args).catch((err) => {
      // console.log(err);
    });
  };
}

export default asyncHandler;
