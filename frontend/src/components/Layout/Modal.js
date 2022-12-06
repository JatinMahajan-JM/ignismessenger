import ReactDOM from "react-dom";

function Modal(props) {
  return ReactDOM.createPortal(
    // <div className="grid w-full h-[100vh] fixed place-items-center top-0 left-0 z-50">
    <div className="grid w-full h100 fixed place-items-center top-0 left-0 z-50">
      <div className=" max-h-[94%] flex flex-col w-[96%] md:w-[33rem] rounded-lg z-40 pad-5 shadow bg-an-1 text-an-text md:px-12 lg:px-12 px-6 py-10 mb-4">
        <div>{props.children}</div>
        <div className="mt-3">
          <button
            className="mt-4 btn mr-2"
            onClick={() => props.setToggle((prev) => !prev)}
          >
            Cancel
          </button>
          {!props.hide && (
            <button className="bg-an-button btn" onClick={props.onClick}>
              {props.buttonName}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modals")
  );
}

export default Modal;
