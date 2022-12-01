import { useCallback, useReducer } from "react";

const reducerFn = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        data: null,
        error: null,
        loading: true,
      };

    case "done":
      return {
        data: action.data,
        error: null,
        loading: false,
      };
    case "error":
      return {
        data: null,
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
};

function useHttp(fn) {
  const [httpState, dispatchFn] = useReducer(reducerFn, {
    data: null,
    error: null,
    loading: null,
  });
  const execute = useCallback(
    async function (fnData) {
      // console.log(fnData);
      dispatchFn({ type: "loading" });
      try {
        const data = await fn(fnData);
        dispatchFn({ type: "done", data });
      } catch (err) {
        dispatchFn({ type: "error", error: err });
      }
    },
    [fn]
  );
  return {
    ...httpState,
    execute,
  };
}

export default useHttp;
