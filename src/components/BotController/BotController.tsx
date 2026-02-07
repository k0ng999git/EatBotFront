import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { API_CONFIG, SOCKET_EVENTS } from "../../constants/api";
import s from "./BotController.module.css";

interface BotState {
  isEnabled: boolean;
  mode: "test" | "deployment";
}

export const BotController: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<"test" | "deployment">("deployment");
  const [isLoading, setIsLoading] = useState(false);
  const [isModeLoading, setIsModeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = React.useRef<Socket | null>(null);

  // Получить состояние при загрузке
  useEffect(() => {
    // Socket.IO подключение для реал-тайм обновлений
    const socket: Socket = io(API_CONFIG.SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.ON.CONNECT, () => {
      console.log("Socket.IO подключен, ID:", socket.id);
      setConnected(true);
      setError(null);
    });

    socket.on(SOCKET_EVENTS.ON.BOT_STATE, (data: BotState) => {
      console.log("Получено обновление состояния:", data);
      setIsEnabled(data.isEnabled);
      setMode(data.mode);
    });

    socket.on(SOCKET_EVENTS.ON.DISCONNECT, () => {
      console.log("Socket.IO отключен");
      setConnected(false);
    });

    socket.on(SOCKET_EVENTS.ON.ERROR, (err: any) => {
      console.error("Socket.IO ошибка:", err);
      setError("Ошибка подключения к серверу");
    });

    socket.on(SOCKET_EVENTS.ON.CONNECT_ERROR, (err: any) => {
      console.error("Socket.IO ошибка подключения:", err);
      setError("Не удалось подключиться к серверу");
    });

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  const handleToggle = () => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError("Потеряно соединение с сервером");
      return;
    }

    try {
      setIsLoading(true);
      socketRef.current.emit(SOCKET_EVENTS.EMIT.TOGGLE_BOT, {
        isEnabled: !isEnabled,
      });
      setError(null);
      // Автоматически отключаем индикатор загрузки через 500мс
      setTimeout(() => setIsLoading(false), 500);
    } catch (err) {
      console.error("Ошибка при переключении бота:", err);
      setError("Не удалось переключить бота");
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: "test" | "deployment") => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError("Потеряно соединение с сервером");
      return;
    }

    try {
      setIsModeLoading(true);
      socketRef.current.emit(SOCKET_EVENTS.EMIT.CHANGE_MODE, {
        mode: newMode,
      });
      setError(null);
      // Автоматически отключаем индикатор загрузки через 500мс
      setTimeout(() => setIsModeLoading(false), 500);
    } catch (err) {
      console.error("Ошибка при смене режима:", err);
      setError("Не удалось изменить режим");
      setIsModeLoading(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.header}>
          <h1 className={s.title}>Bot Control</h1>
          <div
            className={`${s.connectionIndicator} ${connected ? s.connected : s.disconnected}`}
          >
            <div className={s.dot}></div>
            <span>{connected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        <div className={s.statusSection}>
          <div className={s.statusLabel}>Status:</div>
          <div
            className={`${s.statusBadge} ${isEnabled ? s.active : s.inactive}`}
          >
            {isEnabled ? "Active" : "Inactive"}
          </div>
        </div>

        <div className={s.modeSection}>
          <div className={s.statusLabel}>Mode:</div>
          <div className={s.modeButtons}>
            <button
              className={`${s.modeButton} ${mode === "test" ? s.modeActive : ""} ${isModeLoading ? s.loading : ""}`}
              onClick={() => handleModeChange("test")}
              disabled={!connected || isModeLoading}
            >
              {isModeLoading ? "Loading..." : "Test"}
            </button>
            <button
              className={`${s.modeButton} ${mode === "deployment" ? s.modeActive : ""} ${isModeLoading ? s.loading : ""}`}
              onClick={() => handleModeChange("deployment")}
              disabled={!connected || isModeLoading}
            >
              {isModeLoading ? "Loading..." : "Deployment"}
            </button>
          </div>
        </div>

        <button
          className={`${s.button} ${isEnabled ? s.buttonActive : s.buttonInactive} ${isLoading ? s.loading : ""}`}
          onClick={handleToggle}
          disabled={isLoading || !connected}
          title={!connected ? "Ожидание подключения..." : ""}
        >
          {isLoading ? "Loading..." : isEnabled ? "Disable Bot" : "Enable Bot"}
        </button>

        {error && <div className={s.error}>{error}</div>}
      </div>
    </div>
  );
};
