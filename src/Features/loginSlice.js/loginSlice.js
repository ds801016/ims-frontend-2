import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { imsAxios } from "../../axiosInterceptor";
let fav =
  typeof JSON.parse(localStorage.getItem("loggedInUser"))?.favPages == "string"
    ? JSON.parse(JSON.parse(localStorage.getItem("loggedInUser"))?.favPages)
    : JSON.parse(localStorage.getItem("loggedInUser"))?.favPages;

const initialState = {
  user: JSON.parse(localStorage.getItem("loggedInUser"))
    ? {
        ...JSON.parse(localStorage.getItem("loggedInUser")),
        favPages: fav,
      }
    : null,
  testPages: JSON.parse(localStorage.getItem("loggedInUser"))?.testPages,
  notifications: JSON.parse(localStorage.getItem("userNotifications")) ?? [],
  currentLinks: JSON.parse(localStorage.getItem("currentLinks")),
  mobileConfirmed: JSON.parse(localStorage.getItem("loggedInUser"))
    ?.mobileConfirmed,
  emailConfirmed: JSON.parse(localStorage.getItem("loggedInUser"))
    ?.emailConfirmed,
  loading: false,
  token: null,
  message: "",
};
export const loginAuth = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      const { data } = await imsAxios.post("/auth/signin", {
        username: user.username,
        password: user.password,
      });
      if (data.code == 200) {
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            userName: data.data.username,
            token: data.data.token,
            phone: data.data.crn_mobile,
            email: data.data.crn_email,
            id: data.data.crn_id,
            favPages: data.data.fav_pages,
            type: data.data.crn_type,
            mobileConfirmed: data.data.mobileConfirmed,
            emailConfirmed: data.data.emailConfirmed,
          })
        );
        imsAxios.defaults.headers["x-csrf-token"] = data.data.token;
        return await data.data;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      const { message } = err.response.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      toast.info("User Logged Out!");
      state.user = null;

      state.message = "User Logged Out!";
      localStorage.removeItem("loggedInUser");
    },
    addNotification: (state, action) => {
      state.notifications = [
        ...state.notifications,
        action.payload.newNotification,
      ];
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (not) => not.conversationId != action.payload.conversationId
      );
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setFavourites: (state, action) => {
      state.user = { ...state.user, favPages: action.payload };
      console.log(
        JSON.stringify({
          ...state.user,
          favPages: action.payload,
        })
      );
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          ...state.user,
          favPages: action.payload,
        })
      );
    },
    setTestPages: (state, action) => {
      console.log(action.payload);
      state.user = { ...state.user, testPages: action.payload };

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          ...state.user,
          testPages: action.payload,
        })
      );
    },
    setCurrentLinks: (state, action) => {
      console.log(action.payload);
      state.currentLinks = action.payload;

      localStorage.setItem("currentLinks", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAuth.pending, (state) => {
        state.user = null;
        state.token = null;
        state.loading = true;
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = {
          email: action.payload.crn_email,
          phone: action.payload.crn_mobile,
          userName: action.payload.username,
          token: action.payload.token,
          favPages: JSON.parse(action.payload.fav_pages),
          type: action.payload.crn_type,
          mobileConfirmed: action.payload.mobileConfirmed,
          emailConfirmed: action.payload.emailConfirmed,
          // testPages: action.payload.testPages,
          id: action.payload.crn_id,
        };
        state.loading = false;
        state.message = "User Logged in";
      })
      .addCase(loginAuth.rejected, (state, action) => {
        toast.error(action.payload);
        state.message = action.payload;
        state.loading = false;
      });
  },
});

export const {
  logout,
  addNotification,
  removeNotification,
  setNotifications,
  setFavourites,
  setTestPages,
  setCurrentLinks,
} = loginSlice.actions;
export default loginSlice.reducer;
