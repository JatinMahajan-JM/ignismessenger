import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useInput from "../../components/hooks/use-input";

function Login(props) {
  const { err: hasErr } = props;
  const [err, setErr] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const loginHandler = (event) => {
    event.preventDefault();
    props.onLogin({
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

  const formisValid = touched1 && touched2 && !error && !errorPass;

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
        onSubmit={loginHandler}
        className=" max-h-[94%] flex flex-col w-[96%] md:w-[33rem] rounded-lg z-40 pad-5 shadow bg-an-1 text-an-text md:px-12 lg:px-12 px-6 py-10 mb-4"
      >
        <h1 className="text-center text-4xl mb-16 font-bold">Sign in</h1>
        <label htmlFor="email" className="pb-4">
          Email
        </label>
        <input
          type="email"
          placeholder="e.g. you@mail.com"
          ref={emailRef}
          id="email"
          className={style1}
          onChange={(e) => inputChangeHandler(e)}
          onBlur={blurHandler}
        />
        <label htmlFor="password" className="py-4">
          Password
        </label>
        <input
          type="password"
          placeholder="e.g. you12345"
          ref={passwordRef}
          id="password"
          className={style2}
          onChange={(e) => inputPass(e)}
          onBlur={blurPass}
        />
        {err && <p className="italic text-sm mt-2 text-red-400">{err}</p>}
        <button
          disabled={!formisValid ? true : false}
          type="submit"
          className="btn mt-8"
        >
          LOGIN
        </button>
        <div className="flex m-auto mt-8 gap-2">
          <p>Don't have an account?</p>
          <Link to="/signup" className="text-an-button">
            SignUp
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
