import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useInput from "../../components/hooks/use-input";

function SignUp(props) {
  const { err: hasErr } = props;
  const [err, setErr] = useState(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    props.onSignUp({
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
  };

  const {
    error,
    blurHandler,
    inputChangeHandler,
    styles: style1,
    touched: touched1,
  } = useInput(function checkEmail(input) {
    const re =
      /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
  });
  const {
    error: errorPass,
    blurHandler: blurPass,
    inputChangeHandler: inputPass,
    styles: style2,
    touched: touched2,
  } = useInput((v) => v.length >= 3);
  const {
    error: errorName,
    blurHandler: blurName,
    inputChangeHandler: inputName,
    styles: style3,
    touched: touched3,
  } = useInput((v) => v.length >= 2);

  const formisValid =
    touched1 && touched2 && touched3 && !error && !errorPass && !errorName;

  useEffect(() => {
    setErr(hasErr?.message);
  }, [hasErr]);

  useEffect(() => {
    setErr(null);
    return () => {
      setErr(null);
    };
  }, []);

  return (
    <div className="grid place-items-center h-screen">
      <form
        onSubmit={submitHandler}
        className=" max-h-[94%] flex flex-col w-[96%] md:w-[33rem] rounded-lg z-40 pad-5 shadow bg-an-1 text-an-text md:px-12 lg:px-12 px-6 py-10 mb-4"
      >
        <h1 className="text-center text-4xl mb-16 font-bold">Sign up</h1>
        <label htmlFor="name" className="pb-4">
          Your Name
        </label>
        <input
          type="text"
          placeholder="everyman"
          ref={nameRef}
          id="name"
          className={style3}
          onChange={(e) => inputName(e)}
          onBlur={blurName}
        />
        <label htmlFor="emails" className="py-4">
          Email
        </label>
        <input
          type="email"
          placeholder="e.g. you@mail.com"
          ref={emailRef}
          id="emails"
          className={style1}
          onChange={(e) => inputChangeHandler(e)}
          onBlur={blurHandler}
        />
        <label htmlFor="passwords" className="py-4">
          Password
        </label>
        <input
          type="password"
          placeholder="e.g. you12345"
          ref={passwordRef}
          id="passwords"
          className={style2}
          onChange={(e) => inputPass(e)}
          onBlur={blurPass}
        />
        {err && <p className="italic text-sm mt-2 text-red-400">{err}</p>}
        <button
          className="btn mt-8"
          disabled={!formisValid ? true : false}
          type="submit"
        >
          SIGNUP
        </button>
        <div className="flex m-auto mt-8 gap-2">
          <p>Already a member?</p>
          <Link to="/" className="text-an-button">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
