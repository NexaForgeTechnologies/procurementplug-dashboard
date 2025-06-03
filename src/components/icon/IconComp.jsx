import React from "react";

const IconComponent = ({ name, size = 22, color = "white" }) => {
  const icons = {
    dashboard: (
      <svg style={{ width: size, height: size, color: color }} className="transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21" >
        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
      </svg >
    ),
    blog: (
      <svg style={{ width: size, height: size, color: color }} className="transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
      </svg>
    ),
    event: (
      <svg style={{ width: size, height: size, color: color }} className="transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
      </svg>
    ),
    consultant: (
      <svg style={{ width: size, height: size, color: color }} className="transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-3-4a4 4 0 01-4-4V5a4 4 0 018 0v7a4 4 0 01-4 4zM3 20h5v-2a4 4 0 00-3-3.87" />
      </svg>
    ),
    signout: (
      <svg style={{ width: size, height: size, color: color }} className="transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V6" />
      </svg>
    ),
  };

  return (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className="flex items-center justify-center"
    >
      {icons[name]}
    </span>
  );
};

export default IconComponent;
