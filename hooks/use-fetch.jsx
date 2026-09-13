import{useState} from "react";

const useFetch=(cb) =>{
    const[data, setData] = useState(undefined);
    const[isLoading, setIsLoading] = useState(null);
    const[error, setError] = useState(null);

    const fn = async(...args) => {
        setIsLoading(true);
        setError(null);

        try{
            const response = await cb(...args);
            setData(response);
            setError(null);
            return response;
        }catch(error){
            setError(error);
        }
        finally{
            setIsLoading(false);
        }
    };
    return [data, isLoading, error, fn, setData];
};
export default useFetch;
