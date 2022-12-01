import { useState } from "react";

function useInput(validate) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = validate(value);
  const error = touched && !valid;
  let count = 0;

  const inputChangeHandler = (event) => {
    setValue(event.target.value);
    if (count < 1) {
      setTouched(true);
      count++;
    }
  };

  const blurHandler = () => {
    setTouched(true);
  };

  let styles;
  if (!error && !touched) {
    styles = "inputs brbr neutral";
  } else if (touched && !error) {
    styles = "inputs brbr valid";
  } else {
    styles = "inputs brbr invalid";
  }
  return { styles, error, inputChangeHandler, blurHandler, touched };
}

export default useInput;
