import AdminNavbar from "@components/navigation/AdminNavbar";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../navigation/Sidebar/Sidebar";

const AdminLayout = ({ children, title }) => {
  return (
    <div
      aria-label="admin-layout"
      data-testid="admin-layout"
      className="flex flex-col justify-between h-screen"
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta charSet="utf-8" />
        <meta name="description" content="Blooms Hair admin site" />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Sidebar />
      <main className="relative md:ml-64 bg-white dark:bg-gray-900">
        <AdminNavbar />
        <div className="w-full">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
};

AdminLayout.defaultProps = {
  title: "Welcome to Blooms Hair | Admin",
};

export default AdminLayout;
