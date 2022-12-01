import React from "react";

function ErrorPage() {
  return (
    <React.Fragment>
      <div className="grid place-items-center h-[91.5vh]">
        <div className="text-white text-center">
          <h1 className="mb-6 font-bold text-4xl">404 Error</h1>
          <h2>Page not found!</h2>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ErrorPage;
