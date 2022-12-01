import ReactDOM from "react-dom";

function Backdrop() {
  return ReactDOM.createPortal(
    <div className="w-full h-screen z-40 fixed left-0 top-0 ease-in-out opacity-100 bg-[rgba(0,0,0,0.8)]"></div>,
    document.getElementById("backdrop")
  );
}

export default Backdrop;
