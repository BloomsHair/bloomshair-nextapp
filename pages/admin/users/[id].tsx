import { useState, useEffect, useContext } from "react";
import { getSession } from "next-auth/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaPlusCircle } from "react-icons/fa";

import Spinner from "../../../components/Spinner";
import ErrorMessage from "../../../components/ErrorMessage";
import AdminLayout from "../../../components/Layout/AdminLayout";
import Button from "../../../components/Button";

// context
import { useAuth } from "../../../context/auth/AuthContext";

// Get user to confirm if admin
import { getUser } from "../../../lib/getUser";

// Server Url
import { NEXT_URL } from "../../../config";
import { toast } from "react-toastify";

const UserEditScreen = (props) => {
  const router = useRouter();
  const { state, editUser, uploadUserImage } = useAuth();

  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/admin/users");
    }
  }, [state.success]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadUserImage(reader.result);
    };
    reader.onerror = () => {
      toast.error("something went wrong!");
    };
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const image = state.image;
    editUser(props.userId, image, name, email, isAdmin);
  };
  return (
    <AdminLayout>
      <main className="w-full h-screen p-2 mx-auto overflow-auto bg-gray-200">
        <section className="container px-2 pt-6 pb-8 mx-2 mt-6 mb-4 bg-white rounded shadow-xl md:mx-auto ">
          <div className="mt-6">
            <div className="flex items-center justify-between px-2 border-b-4 border-current border-gray-200">
              <div>
                <h1 className="p-5 mt-1 text-5xl font-bold">Edit User</h1>
              </div>
              <Button color="dark" type="button">
                <Link href="/admin/users">
                  <a>Go Back</a>
                </Link>
              </Button>
            </div>
            {state.loading && <Spinner className="w-12 h-12" />}
            {state.error && (
              <ErrorMessage variant="danger">{state.error}</ErrorMessage>
            )}
            <form
              onSubmit={submitHandler}
              className="px-12 pt-6 pb-8 mx-2 mb-4 bg-white rounded sm:mx-auto "
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col items-center mb-4">
                  {state.image ? (
                    <Image
                      src={state.image}
                      alt={name}
                      width={450}
                      height={350}
                    />
                  ) : (
                    <Image
                      src={props.user.image}
                      alt={name}
                      width={450}
                      height={350}
                    />
                  )}
                  <label className="block my-4 mr-2 text-base font-bold text-gray-700">
                    <FaPlusCircle className="text-4xl" />
                    <input
                      type="file"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                  {state.loading && <Spinner className="w-12 h-12" />}
                </div>
                <div className="w-full">
                  <div className="mb-4">
                    <label className="block mb-2 text-base font-bold text-gray-700">
                      Name
                    </label>
                    <input
                      className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none "
                      type="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-base font-bold text-gray-700">
                      Email Address
                    </label>
                    <input
                      className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none "
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center px-4 pt-4 mb-4 border-t-4 border-current border-gray-200">
                <Button type="submit" color="dark">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const req = context.req;
  const { id } = context.params;
  const session = await getSession({ req });

  if (!session) {
    // If no token is present redirect user to the login page
    return {
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }

  const userData = await getUser(req);

  if (!userData?.isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const res = await fetch(`${NEXT_URL}/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  const data = await res.json();

  return {
    props: { user: data, userId: id }, // will be passed to the page component as props
  };
}

export default UserEditScreen;