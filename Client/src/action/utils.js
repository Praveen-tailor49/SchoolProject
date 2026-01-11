import { toast } from 'react-toastify';
import { updateAuth } from '../store/reducer/authReducer';

export const TOAST_SUCCESS = (msg) => {
    toast.success(msg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export const TOAST_ERROR = (msg) => {
    toast.error(msg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export const TOAST_LOADING = () => toast.loading("Loading ...", { position: "bottom-center", hideProgressBar: true, })

export const TOAST_UPDATE = (toastId, type, msg) => toast.update(toastId, {
    position: "bottom-center",
    render: msg,
    type: type,
    isLoading: false,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

export const TOAST_DISMISS = (toastId) => toastId ? toast.dismiss(toastId) : toast.dismiss();

export const ADD_TOKEN = (token) => {
    return (dispatch) => {
        localStorage.setItem('token', token)
        dispatch(updateAuth(token))
    }
}