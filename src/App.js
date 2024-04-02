import { useEffect, useReducer } from "react";

import Header from "./comonents/Header";
import Main from "./comonents/Main";
import Loader from "./comonents/Loader";
import Error from "./comonents/Error";
import StartScreen from "./comonents/StartScreen";

const initialState = {
  questions: [],

  // "loading", "error", "ready", "active", "finished"
  status: "loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  const numQuestion = questions.length;

  useEffect(function () {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        console.log(err);
        dispatch({ type: "dataFailed" });
      }
    }

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestion={numQuestion} />}
      </Main>
    </div>
  );
}
