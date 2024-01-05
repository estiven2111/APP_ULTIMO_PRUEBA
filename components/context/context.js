import React, {createContext, useState} from "react";

export const AuthContext = createContext({})

const ContextProvider = ({children}) => {

    const [inputValue, setInputValue] = useState("")
    const finalValue = (input) => {
        setInputValue(input)
    }

    const resetInputValue = () => {
        setInputValue("")
    }
    
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const persistStartTime = (input) => {
        setStartTime(input)
    }
    const persistEndTime = (input) => {
        setEndTime(input)
    }

    const [infoProject, setInfoProject] = useState({})
    const setProjectData = (input) => {
        setInfoProject({
            ...infoProject,
            input
        })
    }

    const [searchText, setSearchText] = useState('');
    const globalSearch = (input) => {
        setSearchText(input)
    }
    const [showOptions, setShowOptions] = useState(false);
    const globalOptions = (input) => {
        setShowOptions(input)
    }

    const [anticipos, setAnticipos] = useState([]);
    const todosAnticipos = (input) => {
        setAnticipos(input)
    }


    return(
        <AuthContext.Provider value={{finalValue, inputValue, startTime, persistStartTime, endTime, persistEndTime, resetInputValue, infoProject, setProjectData, searchText, globalSearch, showOptions, globalOptions, anticipos, todosAnticipos }}>
            {children}
        </AuthContext.Provider>
    )
}

export default ContextProvider