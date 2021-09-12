import { createContext, useReducer, useContext } from "react";

import { NEXT_URL } from "../../config";
// utils
import { uploadImage } from "../../lib/upload";

type UserInfoProps = {
  id: string;
  name: string;
  image?: string;
  token?: string;
  isAdmin?: boolean;
  email: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

interface InitialAuthState {
  loading: boolean;
  success?: boolean;
  error?: any;
  image?: string;
  message?: string;
}

const initialState = {
  loading: false,
  success: false,
  error: null,
  image: "",
  message: "",
};

enum ActionType {
  USER_ACTION_REQUEST = "USER_ACTION_REQUEST",
  USER_ACTION_FAIL = "USER_ACTION_FAIL",
  USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS",
  USER_UPDATE_PROFILE_SUCCESS = "USER_UPDATE_PROFILE_SUCCESS",
  USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS",
  USER_EDIT_SUCCESS = "USER_EDIT_SUCCESS",
  USER_IMAGE_UPLOAD_SUCCESS = "USER_IMAGE_UPLOAD_SUCCESS",
}

export const authContext = createContext<{
  state: InitialAuthState;
  dispatch: React.Dispatch<any>;
  registerUser: (
    displayName: string,
    email: string,
    password: string,
    isAdmin?: boolean
  ) => void;
  updateUserProfile: (user: UserInfoProps) => void;
  deleteUser: (id: string) => void;
  editUser: (
    id: string,
    image: string,
    displayName: string,
    email: string,
    isAdmin: boolean
  ) => void;
  uploadUserImage: (base64EncodedImage: string | ArrayBuffer) => void;
}>({
  state: initialState,
  dispatch: () => null,
  registerUser: () => {},
  updateUserProfile: () => {},
  deleteUser: () => {},
  editUser: () => {},
  uploadUserImage: () => {},
});

const { Provider } = authContext;

const authReducer = (state: InitialAuthState, action) => {
  switch (action.type) {
    case ActionType.USER_ACTION_REQUEST:
      return { ...state, loading: true };
    case ActionType.USER_ACTION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ActionType.USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload,
      };
    case ActionType.USER_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload,
      };
    case ActionType.USER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload,
      };
    case ActionType.USER_IMAGE_UPLOAD_SUCCESS:
      return { ...state, loading: false, success: true, image: action.payload };
    case ActionType.USER_EDIT_SUCCESS:
      return { ...state, loading: false, success: true };
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * @desc Register a User or admin
   *
   * @param displayName
   * @param email
   * @param password
   */
  const registerUser = async (
    displayName: string,
    email: string,
    password: string,
    isAdmin?: boolean
  ) => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });

      const res = await fetch(`${NEXT_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          email,
          password,
          isAdmin: isAdmin ? isAdmin : false,
          shippingAddress: {
            address: "",
            city: "",
            postalCode: "",
            country: "",
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: ActionType.USER_REGISTER_SUCCESS,
          payload: data.message,
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "User registration Unsuccessful. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  /**
   * @desc Update current logged in user profile details
   *
   * @param user
   * @returns {Promise<void>}
   */
  const updateUserProfile = async (user: UserInfoProps): Promise<void> => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });

      const res = await fetch(`${NEXT_URL}/api/users/updateUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: ActionType.USER_UPDATE_PROFILE_SUCCESS,
          payload: data,
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Unable to update user details. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  /**
   * @desc Delete User profile from the database
   *
   * @params  an id parameter to identify a single user to be deleted
   */

  const deleteUser = async (id: string): Promise<void> => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });

      const res = await fetch(`${NEXT_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: ActionType.USER_DELETE_SUCCESS,
          payload: data.message,
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Unable to delete user. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  /**
   * @desc Admin only. Edit a users profile
   *
   * @param id
   * @param image
   * @param displayName
   * @param email
   * @param isAdmin
   */

  const editUser = async (
    id: string,
    image: string,
    displayName: string,
    email: string,
    isAdmin: boolean
  ) => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });

      const res = await fetch(`${NEXT_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, image, email, isAdmin }),
      });

      if (res.ok) {
        dispatch({
          type: ActionType.USER_EDIT_SUCCESS,
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to edit user. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  /**
   * @desc Upload a base64EncodedImage to cloudinary
   *
   * @param base64EncodedImage
   */
  const uploadUserImage = async (base64EncodedImage: string): Promise<void> => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });
      const data = await uploadImage(base64EncodedImage);

      if (data) {
        dispatch({ type: ActionType.USER_IMAGE_UPLOAD_SUCCESS, payload: data });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Unable to upload image. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  return (
    <Provider
      value={{
        state,
        dispatch,
        registerUser,
        updateUserProfile,
        deleteUser,
        editUser,
        uploadUserImage,
      }}
    >
      {children}
    </Provider>
  );
};

const useAuth = () => {
  return useContext(authContext);
};

export { AuthProvider, useAuth };