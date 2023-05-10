const API_PORT = process.env.REACT_APP_API_PORT;

export const API_URL = `${process.env.REACT_APP_API_URL}${API_PORT ? (":" + API_PORT) : ""}/`;