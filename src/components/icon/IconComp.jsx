import React from "react";

const IconComponent = ({ name, size = 22, color = "white" }) => {
  const icons = {
    "drop-down": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 17 9"
        fill="none"
      >
        <path
          d="M16 0.5L8.5 8L1 0.500001"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    search: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 17 17"
        fill="none"
      >
        <path
          d="M10.9613 10.9548L16 16M12.6667 6.83333C12.6667 10.055 10.055 12.6667 6.83333 12.6667C3.61168 12.6667 1 10.055 1 6.83333C1 3.61168 3.61168 1 6.83333 1C10.055 1 12.6667 3.61168 12.6667 6.83333Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
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
    delete: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 14 18"
        fill="none"
      >
        <path
          d="M1.45403 3.61548H12.9137C13.0607 3.61548 13.2016 3.55711 13.3055 3.45321C13.4094 3.34931 13.4678 3.20839 13.4678 3.06145C13.4678 2.91451 13.4094 2.77359 13.3055 2.66969C13.2016 2.56579 13.0607 2.50742 12.9137 2.50742H1.45403C1.30709 2.50742 1.16617 2.56579 1.06227 2.66969C0.958371 2.77359 0.9 2.91451 0.9 3.06145C0.9 3.20839 0.958371 3.34931 1.06227 3.45321C1.16617 3.55711 1.30709 3.61548 1.45403 3.61548Z"
          fill={color}
          stroke={color}
          strokeWidth="0.2"
        />
        <path
          d="M10.3524 17.0998L10.3526 17.0998C10.8204 17.0989 11.2687 16.9127 11.5994 16.582C11.9302 16.2513 12.1164 15.8029 12.1172 15.3352V15.335V3.05803C12.1172 2.9111 12.0588 2.77018 11.9549 2.66628C11.851 2.56237 11.7101 2.504 11.5632 2.504H2.8095C2.66256 2.504 2.52164 2.56237 2.41774 2.66628C2.31384 2.77018 2.25547 2.9111 2.25547 3.05803V15.335C2.25547 15.803 2.4414 16.2519 2.77236 16.5829C3.10332 16.9138 3.5522 17.0998 4.02024 17.0998H10.3524ZM3.36958 15.335V3.61206H11.0092V15.335C11.0092 15.5092 10.94 15.6762 10.8168 15.7994C10.6937 15.9225 10.5266 15.9917 10.3524 15.9917H4.0263C3.85213 15.9917 3.68509 15.9225 3.56193 15.7994C3.43877 15.6762 3.36958 15.5092 3.36958 15.335Z"
          fill={color}
          stroke={color}
          strokeWidth="0.2"
        />
        <path
          d="M4.75481 3.6123H9.62806C9.775 3.6123 9.91592 3.55393 10.0198 3.45003C10.1237 3.34612 10.1821 3.2052 10.1821 3.05827V1.45403C10.1821 1.30709 10.1237 1.16617 10.0198 1.06227C9.91592 0.958371 9.775 0.9 9.62806 0.9H4.75481C4.60787 0.9 4.46695 0.958371 4.36305 1.06227C4.25915 1.16617 4.20078 1.30709 4.20078 1.45403V3.05827C4.20078 3.2052 4.25915 3.34612 4.36305 3.45003C4.46695 3.55393 4.60787 3.6123 4.75481 3.6123ZM9.06798 2.00806V2.50424H5.31403L5.30971 2.00806H9.06798Z"
          fill={color}
          stroke={color}
          strokeWidth="0.2"
        />
        <path
          d="M4.67555 13.8138C4.77945 13.9177 4.92037 13.9761 5.06731 13.9761C5.21425 13.9761 5.35517 13.9177 5.45907 13.8138C5.56297 13.7099 5.62134 13.569 5.62134 13.4221V5.96086C5.62134 5.81393 5.56297 5.67301 5.45907 5.56911C5.35517 5.46521 5.21425 5.40684 5.06731 5.40684C4.92037 5.40684 4.77945 5.46521 4.67555 5.56911C4.57165 5.67301 4.51328 5.81393 4.51328 5.96086V13.4221C4.51328 13.569 4.57165 13.7099 4.67555 13.8138Z"
          fill={color}
          stroke={color}
          strokeWidth="0.2"
        />
        <path
          d="M8.91383 13.8138C9.01774 13.9177 9.15865 13.9761 9.30559 13.9761C9.45253 13.9761 9.59345 13.9177 9.69735 13.8138C9.80125 13.7099 9.85962 13.569 9.85962 13.4221V5.96087C9.85962 5.81393 9.80125 5.67301 9.69735 5.56911C9.59345 5.46521 9.45253 5.40684 9.30559 5.40684C9.15865 5.40684 9.01774 5.46521 8.91383 5.56911C8.80993 5.67301 8.75156 5.81393 8.75156 5.96087V13.4221C8.75156 13.569 8.80993 13.7099 8.91383 13.8138Z"
          fill={color}
          stroke={color}
          strokeWidth="0.2"
        />
        <path
          d="M7.1884 11.7876C7.04147 11.7876 6.90055 11.7293 6.79665 11.6254C6.69275 11.5215 6.63437 11.3806 6.63437 11.2336V8.15227C6.63437 8.07952 6.6487 8.00747 6.67655 7.94025C6.70439 7.87304 6.7452 7.81196 6.79665 7.76051C6.84809 7.70907 6.90917 7.66826 6.97639 7.64041C7.0436 7.61257 7.11565 7.59824 7.1884 7.59824C7.26116 7.59824 7.3332 7.61257 7.40042 7.64041C7.46764 7.66826 7.52872 7.70907 7.58016 7.76051C7.63161 7.81196 7.67242 7.87304 7.70026 7.94025M7.1884 11.7876L7.70026 7.94025M7.1884 11.7876C7.33534 11.7876 7.47626 11.7293 7.58016 11.6254C7.68406 11.5215 7.74243 11.3806 7.74243 11.2336V8.15227C7.74243 8.07952 7.7281 8.00747 7.70026 7.94025M7.1884 11.7876L7.70026 7.94025"
          fill={color}
          stroke={color}
          strokeWidth="0.2"
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
