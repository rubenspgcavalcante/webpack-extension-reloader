export const SIGN_CHANGE: ActionType = "SIGN_CHANGE";
export const SIGN_RELOAD: ActionType = "SIGN_RELOAD";
export const SIGN_RELOADED: ActionType = "SIGN_RELOADED";
export const SIGN_LOG: ActionType = "SIGN_LOG";
export const SIGN_CONNECT: ActionType = "SIGN_CONNECT";

export const signChange: ActionFactory = ({ reloadPage = true }) => ({
  type: SIGN_CHANGE,
  payload: { reloadPage }
});
export const signReload: ActionFactory = () => ({ type: SIGN_RELOAD });
export const signReloaded: ActionFactory = (msg: string) => ({
  type: SIGN_RELOADED,
  payload: msg
});
export const signLog: ActionFactory = (msg: string) => ({
  type: SIGN_LOG,
  payload: msg
});
