import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import axios from 'services/axios.service';
import {
  type IUserEdit,
  type IUserRegister,
  type IUserResponse,
} from 'shared/interfaces/IUser';
import { isAxiosError } from 'axios';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A restarting API (no response or a gateway error) is retried instead of ending the session.
async function withRetry<T>(request: () => Promise<T>, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await request();
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const isTransient =
        isAxiosError(error) &&
        (!error.response || [502, 503, 504].includes(status as number));
      if (!isTransient || attempt >= attempts) throw error;
      await wait(attempt * 500);
    }
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    try {
      // The API stores the session in HttpOnly cookies; this code never sees a token.
      const response = await axios.post('/user/login', credentials);

      const userResponse = await axios.get('/user');

      return {
        isAuthenticated: true,
        status: response ? response.status : 401,
        user: userResponse.data,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          isAuthenticated: false,
          status: error.response ? error.response.status : 401,
        };
      }

      return {
        isAuthenticated: false,
        status: 401,
      };
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: IUserRegister) => {
    try {
      const response = await axios.post('/user/register', credentials);
      return {
        isAuthenticated: false,
        status: response ? response.status : 500,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          isAuthenticated: false,
          status: error.response ? error.response.status : 401,
        };
      }

      return {
        isAuthenticated: false,
        status: 500,
      };
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    const response = await axios.post('/user/logout');

    return {
      isAuthenticated: false,
      status: response ? response.status : 500,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        isAuthenticated: false,
        status: error.response ? error.response.status : 401,
      };
    }

    return {
      isAuthenticated: false,
      status: 500,
    };
  }
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
  try {
    // The session lives in HttpOnly cookies, so the only way to know is to ask the API.
    // An expired access token is renewed automatically by the axios service.
    const response = await withRetry(() => axios.get('/user'));

    return {
      isAuthenticated: true,
      userStatus: response.status,
      user: response.data,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        isAuthenticated: false,
        // No response means the API is unreachable: show a server error, not the login page.
        userStatus: error.response ? error.response.status : 503,
        user: {} as IUserResponse,
      };
    }

    return {
      isAuthenticated: false,
      userStatus: 500,
      user: {} as IUserResponse,
    };
  }
});

export const getUserByEmail = createAsyncThunk(
  'user/getUserByEmail',
  async (email: string) => {
    try {
      const response = await axios.get(`/user/${email}`);
      return {
        visitedUser: response.data,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          visitedUser: {},
        };
      }

      return {
        visitedUser: {},
      };
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: IUserEdit) => {
    try {
      const response = await axios.patch(`/user/updateUser`, user);
      return {
        status: response ? response.status : 500,
        user: response.data,
        isAuthenticated: true,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          status: error.response ? error.response.status : 409,
          user: {},
          isAuthenticated: true,
        };
      }

      return {
        status: 500,
        user: {},
        isAuthenticated: true,
      };
    }
  },
);

export const addUserAvatar = createAsyncThunk(
  'user/addUserAvatar',
  async (formData: FormData) => {
    try {
      const response = await axios.post('/user/userAvatar', formData);
      return {
        url: response.data.url,
      };
    } catch {
      return {
        url: '',
      };
    }
  },
);

export const deleteUserAvatar = createAsyncThunk(
  'user/deleteUserAvatar',
  async (filePath: string) => {
    try {
      const fileName = filePath.split('uploads/')[1]?.split('/').pop();
      await axios.delete(`/user/userAvatar/${fileName}`);
      return {
        url: '',
      };
    } catch {
      return {
        status: 500,
      };
    }
  },
);

const initialState = {
  status: 200,
  userStatus: 200,
  isAuthenticated: false,
  user: {} as IUserResponse,
  visitedUser: {} as IUserResponse,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 200;
    },
    // The API refused to renew the session, so the user has to sign in again.
    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.user = {} as IUserResponse;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getUser.fulfilled,
      (
        state,
        action: PayloadAction<{
          isAuthenticated: boolean;
          userStatus: number;
          user: IUserResponse;
        }>,
      ) => {
        state.user = action.payload.user;
        state.userStatus = action.payload.userStatus;
        state.isAuthenticated = action.payload.isAuthenticated;
      },
    );
    builder.addCase(getUserByEmail.fulfilled, (state, action) => {
      state.visitedUser = action.payload.visitedUser;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = {} as IUserResponse;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user || ({} as IUserResponse);
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = action.payload.status;
      if (action.payload.status >= 200 && action.payload.status < 300) {
        state.user = action.payload.user as IUserResponse;
      }
    });
  },
});

export const { resetStatus, sessionExpired } = userSlice.actions;

export default userSlice.reducer;
