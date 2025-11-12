import Link from "next/link";

export default function TopBar() {
  return (
    <>
      <section className="border-2 border-dashed flex justify-between sm:items-center p-4 gap-3 mb-4 rounded"
      >
        <div className="flex items-center justify-center">
          <img src="/images/logo.png" alt="" className="h-9 sm:h-10 md:h-12 w-auto" />
        </div>
        <div className="flex gap-2 sm:gap-3 items-center justify-end">
          <Link href={'/auth/login'} className="cursor-pointor">
            <span className="flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#B08D57] bg-[#B08D574D]">
              <img src="/images/signOut.png" alt="" className="object-contain" />
            </span>
          </Link>
          <span className="flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#B08D57] bg-[#B08D574D]">
            <img src="/images/notification.png" alt="" className="object-contain" />
          </span>
        </div>
      </section>
    </>
  );
}