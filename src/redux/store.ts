import { configureStore, combineReducers } from "@reduxjs/toolkit";
import game from "./gameSlice/gameSlice";

const reducer = combineReducers({ game });

export const store = configureStore({
  reducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
