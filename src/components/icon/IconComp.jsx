import React from "react";

const IconComponent = ({ name, size = 22, color = "white" }) => {
  const icons = {
    dashboard: (
      <svg
        style={{ width: size, height: size, color: color }}
        className="transition duration-75"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 21"
      >
        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
      </svg>
    ),
    blog: (
      <svg
        style={{ width: size, height: size, color: color }}
        className="transition duration-75"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 20h9"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4h16v16H4z"
        />
      </svg>
    ),
    event: (
      <svg
        style={{ width: size, height: size, color: color }}
        className="transition duration-75"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
        />
      </svg>
    ),
    consultant: (
      <svg
        style={{ width: size, height: size, color: color }}
        className="transition duration-75"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-3-4a4 4 0 01-4-4V5a4 4 0 018 0v7a4 4 0 01-4 4zM3 20h5v-2a4 4 0 00-3-3.87"
        />
      </svg>
    ),
    signout: (
      <svg
        style={{ width: size, height: size, color: color }}
        className="transition duration-75"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V6"
        />
      </svg>
    ),
    save: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.4884 0C12.8742 0 13.2441 0.153244 13.5169 0.426029L15.574 2.48306C15.8468 2.75585 16 3.12581 16 3.51159V13.8182C16 15.0232 15.0232 16 13.8182 16H2.18182C0.976836 16 0 15.0232 0 13.8182V2.18182C0 0.976836 0.976836 0 2.18182 0H12.4884ZM2.18182 1.45455C1.78016 1.45455 1.45455 1.78016 1.45455 2.18182V13.8182C1.45455 14.2199 1.78016 14.5455 2.18182 14.5455H2.90909V10.1818C2.90909 8.9768 3.88593 8 5.09091 8H10.9091C12.1141 8 13.0909 8.9768 13.0909 10.1818V14.5455H13.8182C14.2199 14.5455 14.5455 14.2199 14.5455 13.8182V4.23886C14.5455 3.85308 14.3922 3.48312 14.1194 3.21033L12.7897 1.88057C12.5169 1.60779 12.1469 1.45455 11.7612 1.45455H11.6364V2.90909C11.6364 4.11407 10.6596 5.09091 9.45455 5.09091H6.54545C5.34047 5.09091 4.36364 4.11407 4.36364 2.90909V1.45455H2.18182ZM11.6364 14.5455V10.1818C11.6364 9.78015 11.3108 9.45455 10.9091 9.45455H5.09091C4.68925 9.45455 4.36364 9.78015 4.36364 10.1818V14.5455H11.6364ZM5.81818 1.45455H10.1818V2.90909C10.1818 3.31075 9.85622 3.63636 9.45455 3.63636H6.54545C6.1438 3.63636 5.81818 3.31075 5.81818 2.90909V1.45455Z"
          fill={color}
        />
      </svg>
    ),
    close: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 17 17"
        fill="none"
      >
        <path
          d="M1 1L16 16"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 16L16 1"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
