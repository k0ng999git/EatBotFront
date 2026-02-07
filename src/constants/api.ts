// API configuration and endpoints
export const API_CONFIG = {
  BASE_URL: "https://eatbotbackbot.onrender.com",
  SOCKET_URL: "https://eatbotbackbot.onrender.com",
};

export const API_ENDPOINTS = {
  BOT: {
    STATE: "/api/bot/state",
    ENABLE: "/api/bot/enable",
    DISABLE: "/api/bot/disable",
    TOGGLE: "/api/bot/toggle",
  },
};

export const SOCKET_EVENTS = {
  EMIT: {
    TOGGLE_BOT: "toggleBot",
    CHANGE_MODE: "changeMode",
  },
  ON: {
    BOT_STATE: "botState",
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",
    CONNECT_ERROR: "connect_error",
  },
};
