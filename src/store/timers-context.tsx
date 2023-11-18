import { type ReactNode, createContext, useContext, useReducer } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = {
  isRunning: true,
  timers: [],
};

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

export const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
  const timerCtx = useContext(TimersContext);

  if (timerCtx === null) {
    throw new Error("TimersCountex is null");
  }

  return timerCtx;
}

type TimersContextProvidedProps = {
  children: ReactNode;
};

type StartTimerAction = {
  type: "START_TIMERS";
};
type StopTimerAction = {
  type: "STOP_TIMERS";
};
type AddTimerAction = {
  type: "ADD_TIMERS";
  payload: Timer;
};

type Action = StartTimerAction | StopTimerAction | AddTimerAction;

function timersReducer(state: TimersState, action: Action): TimersState {
  switch (action.type) {
    case "START_TIMERS":
      return {
        ...state,
        isRunning: true,
      };

    case "STOP_TIMERS":
      return {
        ...state,
        isRunning: false,
      };

    case "ADD_TIMERS":
      return {
        ...state,
        timers: [
          ...state.timers,
          {
            name: action.payload.name,
            duration: action.payload.duration,
          },
        ],
      };

    default:
      return state;
  }
}

export default function TimersContextProvider({
  children,
}: TimersContextProvidedProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);

  const ctx: TimersContextValue = {
    timers: timersState.timers,
    isRunning: timersState.isRunning,
    addTimer(timerData) {
      dispatch({ type: "ADD_TIMERS", payload: timerData });
    },
    startTimers() {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimers() {
      dispatch({ type: "STOP_TIMERS" });
    },
  };

  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
