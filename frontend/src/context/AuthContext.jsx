import React, {createContext, useState, useEffect} from 'react';

// Get user from local storage to initialize it's state if it exists : -> 

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    //this effect runs once when app starts: -> 
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            setCurrentUser(user);
        }
    }, []);

    return(
        <AuthContext.Provider value = {{currentUser, setCurrentUser}} >
            {children}
        </AuthContext.Provider>
    )
}