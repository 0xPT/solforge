import React from "react";

const OutputContext = React.createContext({
  output: "",
  setOutput: (value) => {},
});

export const useOutput = () => {
  return React.useContext(OutputContext);
};

export const OutputProvider = ({ children }) => {
  const [output, setOutput] = React.useState("");

  return (
    <OutputContext.Provider value={{ output, setOutput }}>
      {children}
    </OutputContext.Provider>
  );
};
