import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

// context
import { useOrder } from "../../../context/order/OrderContext";

import Spinner from "../../../components/Spinner";
import ErrorMessage from "../../../components/ErrorMessage";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { getUser } from "../../../lib/getUser";

function CreateOrder() {
  const router = useRouter();
  const { state } = useOrder();

  useEffect(() => {
    if (state.success) {
      router.push("/order");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);
  return (
    <AdminLayout>
      <main className="w-full h-screen p-2 mx-auto bg-gray-100">
        <section className="container px-2 pt-6 pb-8 mx-2 mt-6 mb-4 bg-white shadow-2xl md:mx-auto ">
          <div className="flex items-center justify-between mb-6 border-b-4 border-current border-gray-200">
            <div>
              <h1 className="p-3 text-4xl font-bold md:p-5 md:text-5xl">
                Create Order
              </h1>
            </div>
          </div>
          <div>
            {state.loading ? (
              <Spinner className="w-12 h-12" />
            ) : state.error ? (
              <ErrorMessage variant="danger">{state.error}</ErrorMessage>
            ) : (
              <div></div>
            )}
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const req = context.req;
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

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default CreateOrder;