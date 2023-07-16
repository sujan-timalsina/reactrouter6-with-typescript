import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();
    // const error = useRouteError() as Error;
    const error = useRouteError();
    let errorMessage: string;

    // if (!isRouteErrorResponse(error)) {
    //     return null;
    // }

    if (isRouteErrorResponse(error)) {
        // error is type `ErrorResponse`
        errorMessage = error.error?.message || error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

    // console.log("error");
    // console.error(typeof error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                {/* <i>{error.statusText || error.message}</i> */}
                <i>{errorMessage}</i>
            </p>
            <button onClick={() => navigate(-1)}>&larr; Go back</button>
        </div>
    );
};

export default ErrorPage;