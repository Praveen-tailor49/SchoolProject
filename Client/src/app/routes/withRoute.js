import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"


const withRoute = WrappedComponent => props => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    return <WrappedComponent {...props} {...{navigate, dispatch}}/>
}

export default withRoute