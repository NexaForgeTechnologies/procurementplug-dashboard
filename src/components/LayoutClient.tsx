'use client';

import { usePathname } from "next/navigation";
import SideBar from "@/components/SideBar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const isLogin = pathname === "/auth/login";

   if (isLogin) {
      return <>{children}</>;
   }

   return (
      <>
         {/* Sidebar toggle button for small screens */}
         <button
            data-drawer-target="default-sidebar"
            data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar"
            type="button"
            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 hover:text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-[#85009d] dark:focus:ring-gray-600 cursor-pointer"
         >
            <span className="sr-only">Open sidebar</span>
            <svg
               className="w-6 h-6"
               aria-hidden="true"
               fill="currentColor"
               viewBox="0 0 20 20"
            >
               <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
               />
            </svg>
         </button>

         {/* Sidebar */}
         <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
            aria-label="Sidebar"
         >
            <SideBar />
         </aside>

         {/* Page content */}
         <div className="p-4 sm:ml-64">{children}</div>
      </>
   );
}
