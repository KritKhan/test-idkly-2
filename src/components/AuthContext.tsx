import React from "react";

interface AuthContextInterface {
    loggedIn?: boolean;
    setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = React.createContext<AuthContextInterface>({});

export default AuthContext;
