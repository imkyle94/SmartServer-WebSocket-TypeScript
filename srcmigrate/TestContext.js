import { createContext, useState } from "react";
export const TestContext = createContext({
  email: "",
  setEmailHandler: (email) => {},
});

const TestContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const setEmailHandler = (email) => setEmail(email);

  return (
    <TestContext.Provider value={{ email, setEmailHandler }}>
      {children}
    </TestContext.Provider>
  );
};

export default TestContextProvider;
