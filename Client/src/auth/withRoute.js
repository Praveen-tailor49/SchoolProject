import { useNavigate } from "react-router-dom"


const withRoute = WrappedComponent => props => {
    const navigate = useNavigate();
    return <WrappedComponent {...props} {...{navigate}}/>
}

export default withRoute